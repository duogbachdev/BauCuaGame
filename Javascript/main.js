const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const plusNodeList = $$('.increase')
const minusNodeList = $$('.reduce')
const spin = $('.spin')
const imgDice1 = $('#dice1')
const imgDice2 = $('#dice2')
const imgDice3 = $('#dice3')
const coinsHtml = $$('.coin')
const toastHtml = $('#toast')
const innerCoin = $('.coin-user')

const userData = JSON.parse(localStorage.getItem('userData'))
const user = userData.currenUser

innerCoin.innerText = `${user.coin}`
const app = {
    // totalBet: 0,
    betMoney: [ // mang luu so tien nguoi dat
        { name: 'bau', coin: 0 },
        { name: 'cua', coin: 0 },
        { name: 'tom', coin: 0 },
        { name: 'ca', coin: 0 },
        { name: 'ga', coin: 0 },
        { name: 'nai', coin: 0 },
    ],
    afterDice: [ // mang lưu số lượng xúc sắc quay ra
        { name: 'bau', quanti: 0 },
        { name: 'cua', quanti: 0 },
        { name: 'tom', quanti: 0 },
        { name: 'ca', quanti: 0 },
        { name: 'ga', quanti: 0 },
        { name: 'nai', quanti: 0 }
    ],
    diceBg: [
        "./img/bau.jpg", "./img/cua.jpg", "./img/tom.jpg",
        "./img/ca.jpg", "./img/ga.jpg", "./img/huou.jpg"
    ],
    handelEvents: function() {
        var resultRandomDice1;
        var resultRandomDice2;
        var resultRandomDice3;
        var coinUserBeforDice = user.coin; // dùng để so sách với số tiền ban đầu => tiền thắng thua trong một ván 
        var toast = { // đối tượng thông báo
            title: '',
            coin: '', // nếu hoà sẽ chỉ in ra khoảng trắng '' chứ không in ra số 0
            condition: '',
        };

        // Xử lý sự kiện tăng tiền
        plusNodeList.forEach( (nodeItem, index) => {
            nodeItem.onclick = e => {
                if (user.coin > 0) // Số tiền người dùng đang có phải lớn 0 thì mới cho đặt tiền
                {
                    user.coin -= 1000; // khi dat vao mot o thi tru so tien user
                    var innerCoinUser = $('.coin-user').innerText = `${user.coin}` // Lấy element và in ra số tiền của người dùng sau mỗi một lần ấn đặt tiền
                    this.betMoney[index].coin += 1000; // cộng số tiền đặt vào mảng betMoney ứng với index tương ứng 
                    var coinHtml = $(`.coin.${e.target.classList[1]}`); //Hiển thị số tiền tăng giảm ở trang chính
                    coinHtml.innerText = `${this.betMoney[index].coin}`
                }
            }
        })

        // Xu ly su kien giam tien
        minusNodeList.forEach((nodeItem, index) => {
            nodeItem.onclick = (e) => {
                if (this.betMoney[index].coin > 0) // Ô nào có tiền đã đặt thì mới cho giảm tiền
                {
                    user.coin += 1000;
                    var innerCoinUser = $('.coin-user').innerText = `${user.coin}`
                    this.betMoney[index].coin -= 1000;
                    var coinHtml = $(`.coin.${e.target.classList[1]}`);
                    coinHtml.innerText = `${this.betMoney[index].coin}`
                    if (this.betMoney[index].coin == 0) { // Nếu giảm số tiền đã đặt về 0 thì in ra chuỗi rỗng
                        coinHtml.innerText = '';
                    }
                }
            }
        })

        // Xu ly su kien quay xuc sac
        spin.onclick = (e) => {
            let randomDice = setInterval( () => { // Thay đổi hình ảnh của 3 ô xúc sắc và ramdom 0-5 sau mỗi 50ms
                resultRandomDice1 = Math.floor((Math.random() * 10) % 6);
                resultRandomDice2 = Math.floor((Math.random() * 10) % 6);
                resultRandomDice3 = Math.floor((Math.random() * 10) % 6);

                imgDice1.style.background = `url("${this.diceBg[resultRandomDice1]}") top center / cover no-repeat `
                imgDice2.style.background = `url("${this.diceBg[resultRandomDice2]}") top center / cover no-repeat `
                imgDice3.style.background = `url("${this.diceBg[resultRandomDice3]}") top center / cover no-repeat `
            }, 50);

            setTimeout(() => { // Dừng và xử lý sự kiện sau 2s quay
                clearInterval(randomDice) // Dừng sự kiện quay

                for (let i = 0; i < 6; i++) // So sánh và tăng số lượng xúc sắc nếu quay ra vào mảng afterDice
                {
                    if (i == resultRandomDice1) { this.afterDice[i].quanti += 1 }
                    if (i == resultRandomDice2) { this.afterDice[i].quanti += 1 }
                    if (i == resultRandomDice3) { this.afterDice[i].quanti += 1 }
                }

                for (let i = 0; i < 6; i++) // So sánh với những mặt xúc sắc tung trúng => tiền
                {
                    // Ô nào đặt tiền && ô đó có xúc sắc đã quay ra thì mới tính tiền
                    if (this.betMoney[i].coin > 0 && this.afterDice[i].quanti > 0) {
                        user.coin += this.afterDice[i].quanti * this.betMoney[i].coin + this.betMoney[i].coin;
                    }

                    coinsHtml[i].innerText = ' '; // xoá số tiền tăng giảm hiện thị ở màn hình
                    this.betMoney[i].coin = 0; // cap nhap lai so tien dat = 0
                    this.afterDice[i].quanti = 0; // cập nhập lại số xúc sắc đã quay ra

                }
                // In lai so tien user sau một ván
                innerCoin.innerText = `${user.coin}`

                // Update coin trên Storage sau khi quay
                userData.userList[user.id] = user;
                localStorage.setItem('userData', JSON.stringify(userData))

                // In thông báo(toast) số tiền thắng hoặc thua
                if (user.coin - coinUserBeforDice > 0) {
                    toast.title = 'Lượt này bạn thắng:'
                    toast.coin = `${user.coin - coinUserBeforDice}`
                } else if (user.coin - coinUserBeforDice < 0) {
                    toast.title = 'Lượt này bạn thua:'
                    toast.coin = `${(coinUserBeforDice - user.coin)}` // nhân với trừ 1 để không hiển thị dấu trừ ra ngoài mh
                } else {
                    toast.title = 'Lượt này bạn hoà!'
                    toast.coin = ''
                }
                coinUserBeforDice = user.coin; //Cap nhap lai sau moi lan quay

                // Bat dau tao thong bao
                if (toastHtml) {
                    const newToast = document.createElement('div'); // tao mot the div moi
                    newToast.classList.add('toast'); 
                    newToast.innerHTML = `
                        <div class="outer-container">
                            <i class="fa-solid fa-gamepad icon-conditon-toast"></i>
                            </div>
                            <div class="inner-container">
                            <p>BẦU CUA TÔM CÁ</p>
                            <p>${toast.title} ${toast.coin}</p>
                            </div>
                            <div class="toast-control">
                            <div>Show</div>
                            <div>Later</div>
                        </div>
                    `;
                    toastHtml.appendChild(newToast)
                    // Cập nhập lại mảng toast
                    setTimeout(function() {
                        toastHtml.removeChild(newToast);
                    }, 3500) // sau khoảng thời gian 4s dalay + 1s để fadeOut thì xoá bỏ
                }
            }, 2000)


        }
    },
    start: function() {
        this.handelEvents();
    }
}
app.start();