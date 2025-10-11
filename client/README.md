this project has been made a long time ago, some of the functions are broken and will be fixed soon, since this is a pet project, i have not paid much attention, 
this project is react vite chat app with shadcn components and tailwind css,

in order to install, 

run :

bun install, or npm install

after that, run :

bun run dev


it will run on localhost:5173 if the port is available, 


you will have to enter your username and receiver's name for each other's messages to deliver,

it has notifications being delivered using socketio,

here is the server that you should clone and run in order for this frontend to work:

git clone https://github.com/nodiry/backendchat.git


after installing run : cd serverchat & bun install

after that do not forget to create and add .env file neseccary credentials like mongoose db and jwt secret.
finally run : bun run dev 
it should run 3005 by default even if you do not specify the port.
