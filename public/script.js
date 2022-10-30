let show = false;
let timer;
let searchResults = [];
let chatLi = document.getElementById('list-item'); 
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
let messageChat;

console.log(chatId)


const userId = document.cookie
  .split('; ')
  .find((row) => row.startsWith('userID='))
  ?.split('=')[1];

console.log('userID',userId);

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
        toggleContainer();
        searchInput.value = '';
        searchResultsDiv.classList.add('hidden');
        searchInput.classList.remove('dropdown-opened');
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
        console.log('chatId', chatId);
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
        toggleContainer();
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
          messageChat = response.data.chatId
          socket.emit('chat message', {msg: input.value, chatId: response.data.chatId, senderId: response.data.senderId});
          input.value = '';
          
        })  
    }catch(err){
        console.log('errrrr',err)
    }
} 
 
});

socket.on('chat message', function(data) {
    console.log('msg',data.msg );
    console.log('data.senderId',data.senderId );
    console.log('userId',userId );
    messageChat = data.chatId
    console.log('messageChat', messageChat);
    console.log('chatID', parseInt(chatId));
    console.log('messageChat === chatId',messageChat === chatId );
    let item = document.createElement('div');

    if(parseInt(chatId) === messageChat ){
        // console.log('try to access user id ' , res.locals.user.id)
        if(parseInt(userId) == data.senderId){
            item.classList.add('sender');
            console.log('hellp from sender')
        }else{
            item.classList.add('reciever');
        }
        item.textContent = data.msg;
        messages.appendChild(item);
        messages.scrollTop = messages.scrollHeight;
    }
//   window.scrollTo(0, document.body.scrollHeight);
});


function toggleContainer(){
    if(chatId){
        document.querySelector('#filled').classList.remove('hidden');
        document.querySelector('#plain').classList.add('hidden');

    }else{
        document.querySelector('#filled').classList.add('hidden');
        document.querySelector('#plain').classList.remove('hidden');
    }
}