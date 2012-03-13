#!/bin/sh
cd $0/..

# Copy NAR directory to /etc/nar
cp -R ./* /etc/nar

# Remove install.sh and .git
rm /etc/nar/install.sh
rm -rf /etc/nar/.git

# Add nar script at /bin
echo '#!/bin/sh\nnode /etc/nar/nar' > /bin/nar
chmod +x /bin/nar
