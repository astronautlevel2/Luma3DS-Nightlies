#/bin/bash

commit=$1
git clone git@github.com:AuroraWright/Luma3DS.git
cd Luma3DS
make
zip "Luma3DS-${commit}.zip" out/boot.firm
cp "Luma3DS-${commit}.zip" ../../Luma3DS-Site/latest.zip
echo $commit > ../../Luma3DS-Site/lastCommit
mv "Luma3DS-${commit}.zip" ../../Luma3DS-Site/builds
cd ..
rm -rf Luma3DS
