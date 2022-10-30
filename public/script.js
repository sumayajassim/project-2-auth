// let passwordInput = document.getElementById('inputPassword2');

// const { response } = require("express");

// const { default: axios } = require("axios");

// let showPassword = document.getElementById('showPassword')
let show = false;
let timer;
let searchResults = [];
let chatLi = document.getElementById('list-item'); 
// let searchText = document.getElementById('searchText');
let chatul = document.querySelector('.chats-container');  
let chatId;
let messagesArr;
let socket = io();
let messages = document.getElementById('messages');
let form = document.getElementById('form');
let input = document.getElementById('input');
let newChat;
let searchResultsDiv = document.getElementById('searchResults'); 
let searchInput = document.querySelector('.input-with-left-icon');

// let chatsContainer = document.querySelector('.')
// let chats_ = document.cookie
// .split('; ')
// .find((row) => row.startsWith('chats='))
// ?.split('=')[1];;

// let chats_ = '<%- chats %>'

const userId = document.cookie
  .split('; ')
  .find((row) => row.startsWith('userID='))
  ?.split('=')[1];

console.log('userID',userId);
console.log('chats', Object.freeze(chats_));

function togglePassword(){
    let i = document.getElementById('icon').classList[1].split('-');
    let classitem = document.getElementById('icon');
let type = document.getElementById("inputPassword2").type; 
if(type=='password'){
    document.getElementById("inputPassword2").type = "text";
    i.splice(2,1)
    classitem.className = `fa-solid ${i.join('-')}`
}else{
    document.getElementById("inputPassword2").type = "password"; 
    classitem.className = `fa-solid fa-eye-slash`
    console.log(i);
}
    show = !show 
}

function fetchUsers(event){
    let search = event.target.value;
    clearTimeout(timer);
    // console.log(event.target.value)
    if(search != ''){
    timer = setTimeout(() => {
        axios.get('users', {
            params: {
                search: search
            }
        }).then(response =>{
            searchResults = response.data;
            let template =`
                    <% searchResults.forEach(user => { %>
                        <li class="dropdown-item" onclick="SearchChatClicked(<%=userId%>, <%=user.id%>)">
                            <button class="dropdown-item">
                            <%= user.firstName%> <%=user.lastName%>
                            </button>
                        </li>
                    <% }); %> 
                `
                
              let html = ejs.render(template, {searchResults: searchResults});
              document.getElementById('searchResults').innerHTML = html;
            if(searchResults.length > 0){
                searchResultsDiv.classList.remove('hidden');
                searchInput.classList.add('dropdown-opened');

            }else{
                searchResultsDiv.classList.add('hidden');
                searchInput.classList.remove('dropdown-opened');
            }

        })
    }, 1000);
}else{
    searchResultsDiv.classList.add('hidden');
    searchInput.classList.remove('dropdown-opened');
}

}

function SearchChatClicked(sender, receiver ){
    console.log('sender', sender);
    console.log('receiver', receiver);
    axios.post(`chats/${sender}/${receiver}`)
    .then(response =>{
        let chat = response.data.chat;
        let created = response.data.created;
        console.log(newChat);
        if(created){
            addToChatsList(chat.id , chat.reciever.firstName, chat.reciever.lastName);
        }
        chatClicked(chat.id, chat.reciever.firstName, chat.reciever.lastName);
        searchInput.value = '';
        searchResultsDiv.classList.add('hidden');
        searchInput.classList.remove('dropdown-opened');
        console.log('updated chats',chats_);
        console.log('created chat res',response)
    })
    
}

function addToChatsList(id, firstName, lastName){
    let newChatli = document.createElement('li');
    let newDiv = document.createElement('div');
    newChatli.setAttribute("onclick",`chatClicked(${id},'${firstName}', '${lastName}')`)
    newDiv.classList.add('chat-item');
    newDiv.innerText = `${firstName} ${lastName}`;
    newChatli.appendChild(newDiv);
    chatul.appendChild(newChatli);
   
}

function chatClicked(item, firstName, lastName){
    console.log('item', item)
    console.log('firstName', firstName)
    console.log('lastName', lastName)
    // console.log('chatId', chatId)
    document.getElementById('chatHeaderContainer').innerText = `${firstName} ${lastName}`;

    // chatName.innerText = ;
    axios.get('chats/'+item+'/messages')
    .then(response =>{
        form.action = `/chats/${chatId}/messages`
        chatId = response.data.chatId;
        // userId = response.data.userId;
        messagesArr= response.data.messages;
        console.log('messages', messagesArr);
        let template =`
            <% messagesArr.forEach(message => { %>
                    <% if(message.senderId == userId) {%>
                <div class="sender"><%= message.content%></div>
                <%}else{%>
                    <div class="reciever"><%= message.content%></div>
                <%}%>
            <% }); %> `
                    
        let html = ejs.render(template, {messages: messagesArr});
        messages.innerHTML = html;
        messages.scrollTop = messages.scrollHeight;

    })
}




form.addEventListener('submit', function(e) {
  e.preventDefault();
  if (input.value) {
    console.log('111');
    try{
        axios.post(`chats/${chatId}/messages`, {message: e.target.input.value})
        .then(response =>{
          // response.json(response)
          console.log('response',response);
          // console.log('responseSubmit', response.data)  
          socket.emit('chat message', {msg: input.value, chatId: chatId, senderId: response.data.senderId});
          input.value = '';
          
        })  
    }catch(err){
        console.log('errrrr',err)
    }
} 
 
});

socket.on('chat message', function(data) {
    console.log('msg',data.msg );
    console.log('senderId',data.senderId );
    let item = document.createElement('div');
    // console.log('try to access user id ' , res.locals.user.id)
    if(userId == data.senderId){
        item.classList.add('sender');
    }else{
        item.classList.add('reciever');
    }

    item.textContent = data.msg;
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
//   window.scrollTo(0, document.body.scrollHeight);
});

