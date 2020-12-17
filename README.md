# Boss-ME5-Editer
Javascripted webinterface MIDI control

A while ago I bought an ME-5 Multi Effect pedal manufactured by Boss Roland. Great sound! It is totally analog apart from the reverb/delay. As with all stompboxes -in my experience- the sound is very different using it at home or using it in the rehearsel room or gig. The ME-5 has a headphone output and then it sounds all different again. My peer musicians do not have much patience to wait for me to get the right sound, so I try to program it at home, where the sound is different, but it is never spot on the moment I use it with another amp. What I need is a way to program my floorboard on the spot, without much effort.

Digging into the specs of the ME-5 I noticed it has MIDI capabilities. Would it be possible to control the settings through that?

Short answer: YES IT IS!

Even better: I can do it remote, via Wifi. I could even control it from my house or from anywhere in the world (no use there, but it is possible).


I spent some time comprehending the MIDI protocol, then I spent some more time choosing the right hardware to control it, then I had to learn HTML, javascript, CSS and PHP, and some linux too. But I think I have a working solution now.

My requirements:
- Control all settings of the ME-5 with some platform independent protocol.
- Should be fast, and with a minimum in hardware.
- No pressing buttons on the floorboard (and bend down). Apart from the footswitches of course.
- Getting the ME-5 in manual mode. (Again without pressing any buttons on the floorboard).
- All patches should be available and programmable.
- Changes in patches can be saved/recalled.
- A dump save/load function.
- Low budget.

So I bought myself a raspberry pi zero W and peripheral hardware. Installed it as a webserver, and created a website to control the board from a smartphone. The raspberry acts as an access point in the rehearsel room so I do not need an internet connection. I just log in with my phone, open a webbrowser and all settings are at my disposal.

I now can instantly change any setting with my phone, save it if it is satisfactory, put the ME-5 in manual mode (and back again), change patchnumber. I further can still use all (foot)switches on the ME-5, no functionality is lost.

Hardware needed:

- ME-5 (obviously)
- raspberry pi zero w (*)
- Midi cable (**)

* Any raspberry would do I guess, I used a Zero W. Any computer that can handle a webserver will do, I tested it on Ubuntu.

** Midi cable (USB) or self-build hardware


I will not go into every detail. Here´s the steps I took:

Setup raspberry PI

Install apache
sudo apt-get install apache2 -y
install PHP
sudo apt-get install php5 libapache2-mod-php5 -y
install nfs server (optional)
sudo apt-get install nfs-kernel-server

The following was done as I initially used a RS232 Midi cable. This code works with a USB-MIDI cable. I am not sure the following is required anymore:

For RS232 midi add the following to the end of /boot/config.txt

enable_uart=1
dtoverlay=pi3-miniuart-bt
dtoverlay=midi-uart0

OR

enable_uart=1
dtoverlay=midi_uart1

(I use the latter, that way the bluetooth is still operative)

These commands configure UART1 (ttyS0) so that a requested 38.4kbaud actually gets 31.25kbaud, the frequency required for MIDI

In cmdline.txt
Find and remove any mention of ttyAMA0,115200 such as
“console=ttyAMA0,115200” and “kgdboc=ttyAMA0,115200”.
It should still say "console=tty1" after you've edited it.
edit: in my case it said console=serial0,115200. remove that too.

The for the webserver:

next add the apache user (www-data) to the dialout group
sudo usermod -a -G dialout www-data
check with ´groups www-data´

reboot your pi

sudo mkdir /var/www/html/syx
sudo chown www-data:www-data /var/www/html/syx
sudo chmod 744 /var/www/html/syx

syx is the directory users can write to.

in /etc/php/apache set php.ini
max_input_vars = 3000 (anything larger than ca 2250)
UPDATE: the php.ini file differs in Jessie and does not
need to be altered.

Optional:

Install software to set the raspberry as access point so you do not need to login to some router.
Add a button to shutdown/wake up the raspberry without the need of a keyboard/monitor/mouse/ssh
Add LEDS to show the status of the raspberry.
Add a 9V to 5V regulator to power the raspberry from a 9VDC PSU which is compatible to all my other stompboxes (I can daisychain now)

Access Point:
I followed most of http://www.raspberryconnect.com/network/item/331-raspberry-pi-auto-wifi-hotspot-switch-no-internet-routing

Add button:
Follow: http://www.stderr.nl/Blog/Hardware/RaspberryPi/PowerButton.html#comments

Add a status LED:
In /boot/config add the line:
dtparam=act_led_gpio=23

And connect a led (in series with a resistor of some 2k2) to gpio port 23

Add a 9VDC input port:
Well I used an LM7805 for that, connected a red LED (with 2k2 resistor in series) to the 5V output).

I build a bomb-proof case around it, so it would n´t be destroyed if someone stepped on it (as with my guitar case...)

I am not a programmer or web-designer, so the layout is minimal design. 

You can have the code under the following conditions:

Do not delete the headers. I once wrote a book on integrated optics under contract at the university. The minute my contract ended my name vanished from this very book. Suddenly the head of the department was the author!

Absolutely no warranty whatsoever, use it at your own risk (I did, no smoke yet).
