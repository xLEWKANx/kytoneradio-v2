<xsl:stylesheet xmlns:xsl = "http://www.w3.org/1999/XSL/Transform" version = "1.0">
<xsl:output omit-xml-declaration="no" method="xml" doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN" doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd" indent="yes" encoding="UTF-8" />
<xsl:template match = "/icestats">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title>Icecast Streaming Media Server</title>
	<link rel="stylesheet" type="text/css" href="style.css" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes" />
</head>
<body>
	<h1 id="header">Icecast2 Status</h1>
	<!--index header menu -->
	<div id="menu">
		<ul>
			<li><a href="admin/">Administration</a></li>
			<li><a href="status.xsl">Server Status</a></li>
			<li><a href="server_version.xsl">Version</a></li>
		</ul>
	</div>
	<!--end index header menu -->

	<div id="footer">
		Support icecast development at <a href="http://www.icecast.org">www.icecast.org</a>
	</div>
</body>
<script type="text/javascript">

</script>
</html>
</xsl:template>
</xsl:stylesheet>
