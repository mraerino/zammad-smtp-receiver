import asyncore
import os
from smtpd import SMTPServer
from subprocess import Popen, PIPE

class ZammadServer(SMTPServer):
    def process_message(self, peer, mailfrom, rcpttos, data, **kwargs):
        print(data)
        pipe = Popen("bundle exec rails r 'Channel::Driver::MailStdin.new(trusted: true)'", shell=True, cwd=os.environ['ZAMMAD_DIR'], stdin=PIPE).stdin
        pipe.write(data.encode('utf-8'))
        pipe.close()

def run():
    serv = ZammadServer(('0.0.0.0', 25), None)
    try:
        asyncore.loop()
    except KeyboardInterrupt:
        pass


if __name__ == '__main__':
    run()
