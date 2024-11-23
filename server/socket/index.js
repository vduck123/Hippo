const { Server } = require('socket.io');
const { addUser, getUser, delUser } = require('./user');

const initSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL,
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            credentials: true
        }
    });

    io.on('connection', (socket) => {

        socket.on('join-room', (data) => {
            const { room_id, username } = data;
            const { user, error } = addUser({
                socket_id: socket.id,
                room_id,
                username
            });

            if (error) {
                console.log(error);
                return;
            }

            socket.join(user.room_id);
        });

        socket.on('send-message', (data) => {
            const user = getUser(socket.id);
            if (user) {
                io.to(user.room_id).emit('receive-message', data);
            }
        });

        socket.on('message-group', (data) => {
            const { room_id } = data;
            if (room_id) {
                io.to(room_id).emit('receive-group-message', data);
            }
        });

        socket.on('left-room', () => {
            const user = getUser(socket.id);
            const _user = delUser(socket.id);
            if (_user) {
                socket.leave(_user.room_id);
            }
        });

        socket.on('disconnect', () => {
            const user = getUser(socket.id);
            const _user = delUser(socket.id);
            if (_user) {
                socket.leave(user.room_id);
            }
        });

        socket.on('join-room-userId', (userId) => {
            console.log('user join', userId);
            
            socket.join(userId);
        });

        socket.on('send-notify', ({ senderId, receiverId, data }) => {
            io.to(receiverId).emit('receive-notify', {
                senderId,
                data
            });
        });

        

    });
}

module.exports = initSocket;