#!/bin/sh
#
# Jacob Striebel
# Oct 2017
#
# This script deploys the Beach Monitor App or the Beach Mimic Server
#

have_gotten_path=false

while [ $have_gotten_path = false ]; do

	echo "Input the project directory absolute path (cannot contain \"~\"):"
	read proj_path

	echo "Is this correct \"$proj_path\" (\"yes\" or \"no\"):"
	read have_gotten_path_str

	if [ $have_gotten_path_str = "yes" ]; then

		have_gotten_path=true

	fi

done

echo "Rebuild the war (\"yes\") or use the current war build (\"no\"):"
echo "(Note: if you enter \"no\" and the project_path/build/libs dir doesn't contain the war, then this script will fail.)"

read build_war

if [ $build_war = "yes" ]; then

	echo "Building war ..."
	cd $proj_path
	grails war
	echo "Building war done"

else

	echo "The war was not rebuilt"

fi

invalid_name=true

while [ $invalid_name = true ]; do

    invalid_name=false
    echo "Deploying beach server (\"beach\") or mimic server (\"mimic\"):"
    read proj_name
    if [ $proj_name = "beach" ]; then
        user="2017_sd_4"
        host="hci-dev.cs.mtu.edu"
        password="q4fJcGC6c3"
        proj_name="beaches"
    elif [ $proj_name = "mimic" ]; then
        user="2017_sd_3"
        host="hci-dev.cs.mtu.edu"
        password="7YQ4xprmmU"
        proj_name="BMS2"
    else
        invalid_name=true
        echo "You provided an invalid project name."
    fi

done

echo "Staging war onto tomcat (i.e., scp war user@tomcat:/tmp) ..."

echo "Enter: \"$password\""
war_path="$proj_path""/build/libs/$proj_name"".war"
scp "$war_path" "$user""@$host"":/tmp"

echo "Staging war complete"

echo "ssh into tomcat"

tomcat_path="/var/lib/tomcats/$user""/webapps"

echo "Enter:"
echo $password
#echo "ssh $user""@$host"":/var/lib/tomcats/$user""/webapps"
echo "Once you have ssh'ed in, execute:"
echo "sudo systemctl stop tomcat@$user"
echo "Then execute"
echo "./deploy-server-side"
ssh "$user""@$host"
#"echo \"type: 'sudo systemctl stop tomcat@$user'\"; echo \"password: $password\"; echo \"then type: ./deploy-server-side\"; \"sh\""

exit 0


