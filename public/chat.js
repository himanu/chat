const socket = io();
const {userName,roomNo} = Qs.parse(location.search,{ignoreQueryPrefix : true}); 
const welcomeTemplate = document.getElementById("welcome-template").innerHTML;
const sidebarTemplate = document.getElementById("sidebar-template").innerHTML;
const authorTemplate = document.getElementById("author-template").innerHTML;
const otherTemplate = document.getElementById("other-template").innerHTML;
const chatBox = document.querySelector(".chat-box");
const sidebar = document.querySelector(".sidebar");
var form = document.querySelector("#form");
var input = document.querySelector("#fname");

socket.emit('join',{userName,roomNo},(error)=>{
    if(error)
    {
        alert(error);
        location.href = '/';
    }
});

const autoscroll = () => {
    // New message element
    const $newMessage = chatBox.lastElementChild;

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

    // Visible height
    const visibleHeight = chatBox.offsetHeight;

    // Height of messages container
    const containerHeight = chatBox.scrollHeight;

    // How far have I scrolled?
    const scrollOffset = chatBox.scrollTop + visibleHeight;

    if (containerHeight - newMessageHeight <= scrollOffset) {
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}

form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const message = input.value;
    if(input.value)
    {
        var time = moment(new Date().getTime()).format('h:mm a');
        var view = {
            userName : "You",
            message,
            time
        };
        var html = Mustache.render(authorTemplate,view);
        
        chatBox.insertAdjacentHTML('beforeend',html);
        autoscroll();
        view.userName = userName;
        socket.emit('chat',{userName,message,time,roomNo});
        input.value = '';
    }
})

socket.on('welcome',(welcomeMessage)=>{
    const html = Mustache.render(welcomeTemplate,{welcomeMessage});
    chatBox.insertAdjacentHTML('beforeend',html);
    autoscroll();
})

socket.on('roomData',({roomNo,users})=>{
    console.log(roomNo," ",users);
    const html = Mustache.render(sidebarTemplate,{roomNo,users});
    sidebar.innerHTML = html;
})

socket.on('message',({userName,message,time})=>{
    console.log("message is ",message);
    const html = Mustache.render(otherTemplate,{userName,message,time});
    console.log(html);
    chatBox.insertAdjacentHTML('beforeend',html);
    autoscroll();
})