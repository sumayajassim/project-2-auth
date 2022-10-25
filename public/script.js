// let passwordInput = document.getElementById('inputPassword2');
// let showPassword = document.getElementById('showPassword')
// const axios = require('axios').default;
let show = false;
let timer;
let searchResults = [];
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

    timer = setTimeout(() => {
        // searchResults = searchResults.filter(item => {
        //     return item.email.toLowerCase().indexOf(search.toLowerCase()) !== -1;
        // });
        // axios({
        //     method: 'get',
        //     url: '/users',
        //     data: {
        //         search : search,
        //     }
        axios.get('users', {
            params: {
                search: search
            }
        });

        // axios({

        // })
      
    //    console.log(event.target)
    }, 1000);

}


// showPassword.addEventListener('click', togglePassword(show))
