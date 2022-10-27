// let passwordInput = document.getElementById('inputPassword2');
// let showPassword = document.getElementById('showPassword')

let show = false;
let timer;
let searchResults = [];
let chatLi = document.getElementById('list-item');  
let chatId;
let messagesArr;
// chatLi.addEventListener('click', (item)={

// });

// ejs.render('home.ejs', {searchResults: searchResults});


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
            console.log("response", response.data)
            searchResults = response.data;

            console.log(searchResults);
            let template =`
                    <% searchResults.forEach(user => { %>
                        <li class="dropdown-item-a"><a class="dropdown-item" href="/chat/<%= user.id%>"><%= user.firstName%> <%= user.lastName%></a></li>
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
        

        // axios({

        // })
      
    //    console.log(event.target)
    }, 1000);
}else{
    searchResultsDiv.classList.add('hidden');
    searchInput.classList.remove('dropdown-opened');
}

}


function chatClicked(item, firstName, lastName){
    console.log('item', item)
    console.log('firstName', firstName)
    console.log('lastName', lastName)
    document.getElementById('chatHeaderContainer').innerText = `${firstName} ${lastName}`;

    // chatName.innerText = ;
    axios.get('chats/'+item+'/messages')
    .then(response =>{
        form.action = `/chats/${chatId}/messages`
        chatId = response.data.chatId;
        messagesArr= response.data.messages;
        console.log('messages', messagesArr);
    })
}


let socket = io();
let messages = document.getElementById('messages');
let form = document.getElementById('form');
let input = document.getElementById('input');

form.addEventListener('submit', function(e) {
  e.preventDefault();
  console.log(e.target.input.value);
//   axios({
//     method: 'post',
//     url: '/chats/'+chatId+'/messages',
//     headers: {'Content-Type' : 'application/json'},
//     body: {content: e.target.input.value}
//   })

let requestData = {
    "message":  e.target.input.value
}

  axios.post('/chats/'+chatId+'/messages',requestData )
  .then(function (response) {
    console.log('response', response);
  })
    // console.log('req',req.body.content);
    
  if (input.value) {
    socket.emit('chat message', {msg: input.value, chatId: chatId});
    input.value = '';
  }
});

socket.on('chat message', function(msg) {
  var item = document.createElement('li');
  item.textContent = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});



// showPassword.addEventListener('click', togglePassword(show))
