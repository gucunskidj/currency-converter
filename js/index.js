import { country_code } from './country-list.js';

const dropList = document.querySelectorAll('.drop-list select');
const getButton = document.querySelector('form button');

let fromCurrency = document.querySelector('.from select');
let toCurrency = document.querySelector('.to select');

for (let i = 0; i < dropList.length; i++) {
	for (let currency_code in country_code) {
		let selected;
		if (i === 0) {
			selected = currency_code === 'USD' ? 'selected' : '';
		} else if (i === 1) {
			selected = currency_code === 'RSD' ? 'selected' : '';
		}

		let optionTag = `<option value='${currency_code}' ${selected}>${currency_code}</option>`;
		dropList[i].insertAdjacentHTML('beforeend', optionTag);
	}
	dropList[i].addEventListener('change', (e) => {
		loadFlag(e.target);
	});
}

const loadFlag = (element) => {
	for (let code in country_code) {
		if (code === element.value) {
			let imgTag = element.parentElement.querySelector('img');
			imgTag.src = `https://flagcdn.com/64x48/${country_code[
				code
			].toLowerCase()}.png`;
		}
	}
};

window.addEventListener('load', () => {
	getExchangeRate();
});

getButton.addEventListener('click', (e) => {
	e.preventDefault();
	getExchangeRate();
});

const exchangeIcon = document.querySelector('.drop-list .icon');
exchangeIcon.addEventListener('click', () => {
	let tempCode = fromCurrency.value;
	fromCurrency.value = toCurrency.value;
	toCurrency.value = tempCode;
	loadFlag(fromCurrency);
	loadFlag(toCurrency);
	getExchangeRate();
});

const getExchangeRate = () => {
	const amount = document.querySelector('.amount input');
	const exchangeRateTxt = document.querySelector('.exchange-rate');
	let amountVal = amount.value;

	if (amountVal === '' || amountVal === '0') {
		amount.value = '1';
		amountVal = 1;
	}

	exchangeRateTxt.innerText = 'Getting exchange rate...';

	let url = `https://api.exchangerate.host/convert?from=${fromCurrency.value}&to=${toCurrency.value}`;
	fetch(url)
		.then((response) => response.json())
		.then((result) => {
			let exchangeRate = result.result;
			let totalExchangeRate = (amountVal * exchangeRate).toFixed(2);

			exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${totalExchangeRate} ${toCurrency.value}`;
		})
		.catch(() => {
			exchangeRateTxt.innerText = 'Something went wrong';
		});
};
