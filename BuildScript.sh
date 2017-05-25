#/bin/bash

commit=$1
branch=$2
git clone git@github.com:AuroraWright/Luma3DS.git
cd Luma3DS
git checkout ${branch}
make
zip "Luma3DS-${commit}.zip" out/boot.firm
cp "Luma3DS-${commit}.zip" ../../Luma3DS-Site/latest.zip
echo $commit > ../../Luma3DS-Site/lastCommit
mv "Luma3DS-${commit}.zip" ../../Luma3DS-Site/builds
cd ..
rm -rf Luma3DS
