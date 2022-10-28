// let passwordInput = document.getElementById('inputPassword2');
// let showPassword = document.getElementById('showPassword')
let show = false;
let timer;
let searchResults = [];
let chatLi = document.getElementById('list-item');  
let chatId;
let messagesArr;
let socket = io();
let messages = document.getElementById('messages');
let form = document.getElementById('form');
let input = document.getElementById('input');
let userId ;
let senderClass = 'sender';
let receiverClass= 'reciever';


const cookieValue = document.cookie
  .split('; ')
  .find((row) => row.startsWith('userId='))
  ?.split('=')[1];

console.log(cookieValue);

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
    let searchResultsDiv = document.getElementById('searchResults'); 
    let searchInput = document.querySelector('.input-with-left-icon');
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
                        <li class="dropdown-item">
                            <button class="dropdown-item">
                            <%= user.firstName%> <%=user.lastName%>
                            </button>
                        </li>
                    <% }); %> 
                `
                //onclick="SearchChatClicked(<%=userId%>, <%=user.id%>)"
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

// function SearchChatClicked(sender, receiver ){
//     console.log('sender', sender);
//     console.log('receiver', receiver);
    
// }
function chatClicked(item, firstName, lastName){
    console.log('item', item)
    console.log('firstName', firstName)
    console.log('lastName', lastName)
    console.log('chatId', chatId)
    document.getElementById('chatHeaderContainer').innerText = `${firstName} ${lastName}`;

    // chatName.innerText = ;
    axios.get('chats/'+item+'/messages')
    .then(response =>{
        form.action = `/chats/${chatId}/messages`
        chatId = response.data.chatId;
        userId = response.data.userId;
        messagesArr= response.data.messages;
        // console.log('messages', messagesArr);
        let template =`
            <% messagesArr.forEach(message => { %>
                    <% if(message.senderId === userId) {%>
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
  axios.post('/chats/'+chatId+'/messages', {message: e.target.input.value})
  .then(function (response) {
    console.log('responseSubmit', response.data)
    //     messages = response;

    //      
    if (input.value) {
        socket.emit('chat message', {msg: input.value, chatId: chatId, senderId: response.data.senderId});
        input.value = '';
      }  
  })    
 
});

socket.on('chat message', function(data) {
    console.log('msg',data.msg );
    console.log('senderId',data.senderId );
  let item = document.createElement('div');
    // console.log('try to access user id ' , res.locals.user.id)
    if(userId === data.senderId){
        item.classList.add('sender');
    }else{
        item.classList.add('reciever');
    }

  item.textContent = data.msg;
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
//   window.scrollTo(0, document.body.scrollHeight);
});

