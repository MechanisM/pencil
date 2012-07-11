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

## Example
	<!DOCTYPE HTML>
	<html>
		<head>
			<script src="jquery.min.js"></script>
			<script src="jquery.form.js"></script>
			<script src="pencil.js"></script>
			<link rel="stylesheet" type="text/css" href="pencil.css" />
			<script>
				$(function(){
					$('#editor').pencil();
				});
			</script>
		</head>
		<body>
			<textarea id="editor">
		</body>
	</html>

