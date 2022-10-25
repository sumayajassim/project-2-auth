// let passwordInput = document.getElementById('inputPassword2');
// let showPassword = document.getElementById('showPassword')

let show = false;
let timer;
let searchResults = [];

ejs.render('home.ejs', {searchResults: searchResults});


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
    clearTimeout(timer);
    // console.log(event.target.value)

    timer = setTimeout(() => {
        axios.get('users', {
            params: {
                search: search
            }
        }).then(response =>{
            console.log("response", response.data)
            searchResults = response.data;

            console.log(searchResults);
            if(searchResults.length > 0){
                searchResultsDiv.classList.remove('hidden');
            }
            ejs.render('home', {searchResults: searchResults});

        })
        

        // axios({

        // })
      
    //    console.log(event.target)
    }, 1000);

}


// showPassword.addEventListener('click', togglePassword(show))
