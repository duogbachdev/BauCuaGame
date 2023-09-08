const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const signingForms = $$('.signing-form');
const leaveToSignUp = $('.leave-to-sign-up');  
const leaveToSignIn = $('.leave-to-sign-in');  
const signupStateHeader = $('.signup-state')
const signinStateHeader = $('.signin-state')
const SignInForm = $('.sign-in-container')
const SignUpForm = $('.sign-up-container')

var userData = JSON.parse(localStorage.getItem('userData')) || {};
var userList = userData.userList || []
var currenUser = userData.currenUser || null
const SigningApp = {
    handelSigning() {
        signingForms.forEach(form => { // handle form
            form.onsubmit = e => {
                e.preventDefault();
                const gmail = form.querySelector('input[name="gmail"]').value;
                const pass = form.querySelector('input[name="password"]').value;
                const userInput = {
                    gmail,
                    pass
                };
                //Đăng Nhập
                if (form.matches('#sign-in')) { 
                    const user = this.findGmail(userList, userInput.gmail); 
                    if (user) { 
                        if (user.pass === userInput.pass){
                            userData.currenUser = user;
                            window.location.href = "./main.html"
                        }
                    }
                } else {  //Dang ky
                    const name = form.querySelector('input[name="name"]').value;
                    if (gmail.trim() !== '' && !this.findGmail(userList, userInput.gmail)) {
                        let user = {
                            name,
                            id: userList.length,
                            gmail,
                            pass,
                            coin: 10000,
                        }
                        userList.push(user)
                        currenUser = user;
                        userData = {
                            currenUser,
                            userList
                        }
                        localStorage.setItem('userData', JSON.stringify(userData))
                        window.location.href = "./index.html"
                    }
                }
            }
        })
    },
    findGmail(userList,gmail) { 
        return userList.find(user => {
            return user.gmail === gmail;
        });
    },
    changeStateForm ()  {
        function moveToOtherForm () {
            SignInForm.classList.toggle('active')
            SignUpForm.classList.toggle('active')
            signupStateHeader.classList.toggle('signing-active')
            signinStateHeader.classList.toggle('signing-active')
        }

        leaveToSignUp.onclick = moveToOtherForm
        leaveToSignIn.onclick = moveToOtherForm
        signupStateHeader.onclick = moveToOtherForm
        signinStateHeader.onclick = moveToOtherForm

        // leaveToSignUp.onclick = () => {
        //     SignInForm.classList.toggle('active')
        //     SignUpForm.classList.toggle('active')
        //     signupStateHeader.classList.toggle('signing-active')
        //     signinStateHeader.classList.toggle('signing-active')
        // }
        // leaveToSignIn.onclick = () => {
        //     SignUpForm.classList.toggle('active')
        //     SignInForm.classList.toggle('active')
        //     signupStateHeader.classList.toggle('signing-active')
        //     signinStateHeader.classList.toggle('signing-active')
        // }
    },
    start: function() {
        this.handelSigning();
        this.changeStateForm();
    }
}
SigningApp.start();
