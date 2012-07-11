# Pencil
Simple jQuery HTML5 WYSIWYG

## Author
Ilya Shalyapin, ishalyapin@gmail.com

## Status
Unstable

## Features
AJAX image uploading

##Browser compatibility
Firefox, Opera, Chome.

## Requirements
 - jQuery (http://jquery.com/)
 - JQuery Form Plugin (http://malsup.com/jquery/form/)

##TODO
 - Make possible to use 2 or more WYSIWYG in a page
 - Test in IE

## USAGE
	<!DOCTYPE HTML>
	<html>
		<head>
			<script src="jquery.min.js"></script>
			<script src="jquery.form.js"></script>
			<script src="pencil.js"></script>
			<link rel="stylesheet" type="text/css" href="pencil.css" />
			<script>
				$(function(){
					$('#editor').pencil({'uploaderUrl':'/my-uploader/'});
				});
			</script>
		</head>
		<body>
			<textarea id="editor">
		</body>
	</html>
	
### AJAX image uploader
	Uploader should return JSON (content_type='application/json; charset=utf-8'):
	{'url': '/media/123.jpg'}
	
	In case of error:
	{'error':'some error message'}

