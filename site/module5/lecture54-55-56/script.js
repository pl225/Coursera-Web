document.addEventListener('DOMContentLoaded', (event) => {

	function sayHello(event) {
		
		const name = document.getElementById('name').value;
		const message = "<h2>Hello " + name + "!</h2>";

		this.textContent = 'Said it!';

		document
			.getElementById('content')
			.innerHTML = message;

		if (name === 'student') {
			document
				.querySelector('#title')
				.textContent +=  ' & loving it!';
		}

	}

	document
		.querySelector('button')
		.addEventListener('click', sayHello);


	document
		.querySelector('body')
		.addEventListener('mousemove', (event) => {
			if (event.shiftKey === true) {
				console.log(event.clientX, event.clientY);
			}
		});

});