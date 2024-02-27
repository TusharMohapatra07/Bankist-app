//Data

const account1 = {
  owner: 'John Doe',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.3,
  pin: 1111,
  movementsDates: [
    '2020-08-15T09:30:45.123Z',
    '2021-03-20T18:12:37.456Z',
    '2021-07-05T14:59:28.789Z',
    '2022-02-10T08:45:12.345Z',
    '2022-05-15T20:30:54.678Z',
    '2023-01-05T12:08:23.901Z',
    '2023-04-20T17:36:45.234Z',
    '2023-09-12T06:59:17.890Z',
  ]
};

const account2 = {
  owner: 'Alice Smith',
  movements: [1000, -200, 340, -500, -40, 300, -150, 200],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2020-09-25T12:45:32.987Z',
    '2021-04-10T16:22:48.901Z',
    '2021-08-28T10:07:36.543Z',
    '2022-03-05T22:18:59.012Z',
    '2022-06-20T06:33:21.234Z',
    '2023-02-15T14:40:29.567Z',
    '2023-07-30T19:55:41.890Z',
    '2023-12-18T09:20:53.321Z',
  ]
};

const account3 = {
  owner: 'Bob Johnson',
  movements: [300, 50, -200, 1000, -120, -80, 40, 800],
  interestRate: 1.2,
  pin: 3333,
  movementsDates: [
    '2019-12-01T15:30:20.456Z',
    '2020-04-10T11:25:49.789Z',
    '2020-08-21T08:12:37.890Z',
    '2021-02-14T20:45:32.123Z',
    '2021-06-29T18:03:54.567Z',
    '2022-01-15T09:27:08.901Z',
    '2022-05-20T13:54:36.234Z',
    '2022-10-12T03:17:09.567Z',
  ]
};

const account4 = {
  owner: 'Emily Davis',
  movements: [800, -100, 200, -300, 50, 600, -250, 1200],
  interestRate: 1.4,
  pin: 4444,
  movementsDates: [
    '2019-11-05T10:15:30.987Z',
    '2020-03-15T14:40:41.234Z',
    '2020-07-26T06:28:53.567Z',
    '2021-01-10T18:05:09.012Z',
    '2021-05-25T22:22:17.345Z',
    '2022-01-01T11:47:28.678Z',
    '2022-06-10T16:14:56.890Z',
    '2022-11-28T05:37:29.123Z',
  ]
};

const accounts = [account1, account2, account3, account4];

//Selections
const loginPage = document.querySelector('.login-page');
const accountPage = document.querySelector('.account');
const loginUser = document.querySelector('.login-page__username');
const loginPassword = document.querySelector('.login-page__password');
const accountName = document.querySelector('.account__name');
const loginBtn = document.querySelector('.login-page__button');
const logoutBtn = document.querySelector('.account__button');
const movementUl = document.querySelector('.account__movements');
const balance = document.querySelector('.account__balance');
const inAmount = document.querySelector('.account__in-amount');
const outAmount = document.querySelector('.account__out-amount');
const interestAmount = document.querySelector('.account__interest-amount');
const transferBtn = document.querySelector('.account__transfer-button');
const transferTo = document.querySelector('.account__transfer-to');
const transferAmount = document.querySelector('.account__amount');
const loanAmount = document.querySelector('.account__loan-amount');
const loanBtn = document.querySelector('.account__loan-button');
const closeUser = document.querySelector('.account__user');
const closePin = document.querySelector('.account__pin');
const closeBtn = document.querySelector('.account__close-button');
const sortBtn = document.querySelector('.account__sort-button');
const accountDate = document.querySelector('.account__date');
const timer = document.querySelector('.account__logout-time');
let loggedInUser, logoutTimer;
accountPage.classList.add('hide');


//Update UI

const UpdateUI = function(currentAccount){
  displayMovements(currentAccount);
  calculateBalance(currentAccount.movements);
  displaySummary(currentAccount.movements);
  updateDate();
  if(logoutTimer) clearInterval(logoutTimer);
  logoutTimer = startTimer();
};

//Display movements
const displayMovements = function(user){
  movementUl.innerHTML = '';
  user.movements.forEach(function(mov,i) {
    const li = document.createElement('li');
    li.className = 'account__movement';

    const movementNo = document.createElement('p');
    movementNo.className = `account__movement-${ mov>=0 ? 'deposit' : 'withdrawal' }`;
    movementNo.innerText = `${i+1} ${mov>=0 ? 'DEPOSIT' : 'WITHDRAWAL' }`;
    li.appendChild(movementNo);

    const movementDate = document.createElement('p');
    movementDate.className = `account__movement-date`;
    const date = new Date(user.movementsDates[i]);
    movementDate.innerText = buildDate(date).split(' ')[0];
    li.appendChild(movementDate);
    
    const movementAmount = document.createElement('p');
    const span = document.createElement('span');
    movementAmount.className = `account__movement-amount`;

    span.className = `account__currency`;
    span.innerText = `₹`;
    movementAmount.appendChild(span);
    
    movementAmount.insertAdjacentHTML('beforeend',`${mov}`);
    li.appendChild(movementAmount);

    movementUl.appendChild(li);
  });
};

//Calculate balance
const calculateBalance = function(movements){
  const sum = movements.reduce((acc,curr) => acc + curr, 0);
  balance.childNodes[1].textContent = sum;
};

//Calculate summary
const displaySummary = function(movements){
  const incoming = movements.filter(mov => mov > 0).reduce( (acc, mov) => acc + mov, 0);
  inAmount.innerText = `₹${incoming}`;

  const outgoing = movements.filter(mov => mov < 0).reduce(( acc, mov) => acc + mov, 0);
  outAmount.innerText = `₹${Math.abs(outgoing)}`;

  const interest = incoming * loggedInUser.interestRate / 100;
  interestAmount.innerText = `₹${interest}`;
};

//Login functionality
const login = function(user){
  loginPage.classList.add('hide');
  accountPage.classList.remove('hide');
  loginUser.value = '';
  loginPassword.value = '';
  accountName.innerText = user.owner.split(' ')[0];  
};

loginBtn.addEventListener('click', () => {
  loggedInUser = accounts.find(acc => acc.owner === loginUser.value.trim());
  if(loggedInUser?.pin === Number(loginPassword.value)){
    login(loggedInUser);
    UpdateUI(loggedInUser);
  } else {
    alert('Please enter correct credentials');
  }
});

//Logout functionality
const logout = function(user){
  accountPage.classList.add('hide');
  loggedInUser = '';
  loginPage.classList.remove('hide');
};

logoutBtn.addEventListener('click', () => {
    if(!confirm('Are you sure ?')){
      return;
    }
    logout(loggedInUser);
    clearInterval(logoutTimer);
});

//Transfer functionality
transferBtn.addEventListener('click', () => {
    const user  = accounts.find( acc => acc.owner === transferTo.value.trim());
    if(transferTo.value.trim() === loggedInUser.owner) {
      alert('You cannot self-transfer');
      return;
    }
    if(!user){
      alert('Please enter valid credentials');
      return;
    }
    const amount = Number(transferAmount.value);
    if(amount < 0 || amount > Number(balance.childNodes[1].textContent)) {
      alert('Please enter a valid amount');
      return;
    }
    loggedInUser.movements.push(-1 * amount);
    user?.movements.push(amount);
    const date = new Date();
    const IsoDate = date.toISOString();
    loggedInUser.movementsDates.push(IsoDate);
    user?.movementsDates.push(IsoDate);
    transferTo.value = '';
    transferAmount.value = '';
    UpdateUI(loggedInUser);
});

//Request loan
loanBtn.addEventListener('click', () => {
  const amount = Number(loanAmount.value);
  if(loggedInUser.movements.some(mov => mov >= amount * 10 / 100)){
      loggedInUser.movements.push(amount);
      const date = new Date();
      const IsoDate = date.toISOString();
      loggedInUser.movementsDates.push(IsoDate);
      loanAmount.value = '';
      setTimeout(() => {UpdateUI(loggedInUser)}, 2000);
  } else{
    alert("You're not eligible for this transaction");
    loanAmount.value = '';
  }
});

//Close account 
closeBtn.addEventListener('click', () => {
    if(closeUser.value.trim() === loggedInUser.owner && Number(closePin.value) === loggedInUser.pin && confirm('Are you sure?')){
      const index = accounts.findIndex( user => user.owner === loggedInUser.owner);
      accounts.splice(index,1);
      closeUser.value = "";
      closePin.value = "";
      logout(loggedInUser);
    } else {
      alert('Please enter correct credentials');
    }
});

//Sorting array
let sort = false;
sortBtn.addEventListener('click',() => {
    sort = !sort;
    const val = sort ? loggedInUser.movements.slice().sort((a,b) => a - b) : loggedInUser.movements;
    const obj = {};
    obj.movements = val;
    obj.movementsDates = [];
    val.forEach( (mov) => {
      const idx = loggedInUser.movements.indexOf(mov);
      const date = loggedInUser.movementsDates[idx];
      obj.movementsDates.push(date);
    });
    displayMovements(obj);
})


//Update current date
const updateDate = function(){
  const now = new Date();
  accountDate.innerText = buildDate(now);
};

function buildDate(date){
  const date1 = `${date.getDate()}`.padStart(2, 0);
  const month = `${date.getMonth() + 1}`.padStart(2,0);
  const year = date.getFullYear();
  const hours = `${date.getHours()}`.padStart(2, 0);
  const minutes = `${date.getMinutes()}`.padStart(2, 0);
  return `${date1}/${month}/${year} ${hours}:${minutes}`;
}

function startTimer(){
  let time = 5*60;

  const func = () => {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String((time % 60)).padStart(2, 0);

    timer.textContent = `${min}:${sec}`;
    if(time === 0){
      clearInterval(countdown);
      logout(loggedInUser);
    }
    time--;
  };
  func();
  const countdown = setInterval(func,1000);
  return countdown;
}