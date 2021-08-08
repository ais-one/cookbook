https://stackoverflow.com/questions/52511778/how-to-install-openjdk-11-on-windows


Extract the zip file into a folder, e.g. C:\Program Files\Java\ and it will create a jdk-11 folder (where the bin folder is a direct sub-folder). You may need Administrator privileges to extract the zip file to this location.

Set a PATH:

Select Control Panel and then System.
Click Advanced and then Environment Variables.
Add the location of the bin folder of the JDK installation to the PATH variable in System Variables.
The following is a typical value for the PATH variable: C:\WINDOWS\system32;C:\WINDOWS;"C:\Program Files\Java\jdk-11\bin"
Set JAVA_HOME:

Under System Variables, click New.
Enter the variable name as JAVA_HOME.
Enter the variable value as the installation path of the JDK (without the bin sub-folder).
Click OK.
Click Apply Changes.
Configure the JDK in your IDE (e.g. IntelliJ or Eclipse).
You are set.

To see if it worked, open up the Command Prompt and type java -version and see if it prints your newly installed JDK.

If you want to uninstall - just undo the above steps.

Note: You can also point JAVA_HOME to the folder of your JDK installations and then set the PATH variable to %JAVA_HOME%\bin. So when you want to change the JDK you change only the JAVA_HOME variable and leave PATH as it is.
