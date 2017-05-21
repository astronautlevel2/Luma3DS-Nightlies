#/bin/bash

commit=$1
git clone git@github.com:AuroraWright/Luma3DS.git
cd Luma3DS
make
zip "Luma3DS-${commit}.zip" out/boot.firm
mv "Luma3DS-${commit}.zip" ../
cd ..
rm -rf Luma3DS
