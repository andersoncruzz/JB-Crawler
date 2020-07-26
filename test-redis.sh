while ! (printf "PING\n\r") | netcat -c localhost 6379; do
echo 'Waiting redis...'
sleep 2;
done
