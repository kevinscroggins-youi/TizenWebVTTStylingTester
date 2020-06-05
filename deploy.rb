#!/usr/bin/env ruby

$ip_address = ""
$package_name = "METqbFQfdP"
$application_id = $package_name + "." + "WebVTTStylingTester"
$project_name = "WebVTT Styling Tester"

require "open3"
require "ostruct"
require "io/console"
require "fileutils"

begin
	require "Win32API"

	def get_char()
		Win32API.new("crtdll", "_getch", [], "L").Call
	end
rescue LoadError
	def get_char()
		state = `stty -g`
		`stty raw -echo -icanon isig`

		STDIN.getc.chr
	ensure
		`stty #{state}`
	end
end

$windows = false
$linux = false
$solaris = false
$osx = false
$unsupported_os = false

case RbConfig::CONFIG["host_os"]
	when /mswin|windows|mingw/i
		$operating_system = "windows"
		$windows = true
	when /linux|arch/i
		$operating_system = "linux"
		$linux = true
	when /sunos|solaris/i
		$operating_system = "solaris"
		$solaris = true
		$unsupported_os = true
	when /darwin/i
		$operating_system = "osx"
		$osx = true
	else
		$operating_system = "unknown"
		$unsupported_os = true
end

def join_paths(*args)
	if args.nil? or args.length == 0
		return nil
	end

	path = nil

	args.each do |arg|
		if path.nil?
			path = arg
		else
			path = File.join(path, arg)
		end
	end

	if $windows
		path = path.gsub(File::SEPARATOR, File::ALT_SEPARATOR || File::SEPARATOR)
	end

	return path
end

$app_dir = "app"
$output_dir = "temp"
$wgt = $project_name + ".wgt"
$assets_directory_path = "assets"
$scripts_directory_path = join_paths($assets_directory_path, "scripts")
$stylesheets_directory_path = join_paths($assets_directory_path, "stylesheets")
$fonts_directory_path = join_paths($assets_directory_path, "fonts")
$output_wgt_path = join_paths($output_dir, $wgt);

if File.file?($wgt)
	FileUtils.remove_file($wgt)
end

FileUtils.mkdir_p(join_paths($output_dir, $stylesheets_directory_path))
FileUtils.mkdir_p(join_paths($output_dir, $scripts_directory_path))
FileUtils.mkdir_p(join_paths($output_dir, $fonts_directory_path))

FileUtils.copy(Dir.glob(join_paths($app_dir, "*.xml")), $output_dir)
FileUtils.copy(Dir.glob(join_paths($app_dir, "*.html")), $output_dir)
FileUtils.copy(Dir.glob(join_paths($app_dir, "*.png")), $output_dir)
FileUtils.copy(Dir.glob(join_paths($app_dir, $stylesheets_directory_path, + "*.css")), join_paths($output_dir, $stylesheets_directory_path))
FileUtils.copy(Dir.glob(join_paths($app_dir, $fonts_directory_path, + "*.*")), join_paths($output_dir, $fonts_directory_path))
FileUtils.copy(Dir.glob(join_paths($app_dir, $scripts_directory_path, "*.js")), join_paths($output_dir, $scripts_directory_path))

system("tizen package --type wgt -- " + $output_dir)

$target = ""

if !$ip_address.to_s.empty?
	$target = " -s " + $ip_address + ":26101 "
end

if File.file?($output_wgt_path)
	FileUtils.move($output_wgt_path, $wgt.gsub!(/[ \t]+/, ""))

	if File.directory?($output_dir)
		FileUtils.remove_dir($output_dir);
	end

	system("sdb start-server")

	if !$ip_address.to_s.empty?
		system("sdb disconnect")
		system("sdb connect " + $ip_address + ":26101")
	end

	system("sdb " + $target + " shell \"0 rmfile any_string\"")
	system("tizen uninstall " + $target + " -p " + $application_id)
	system("sdb " + $target + " shell \"0 rmfile any_string\"")
	system("tizen install " + $target + " -n " + $wgt)
	system("tizen run " + $target + " -p " + $application_id)
end
