document.addEventListener('DOMContentLoaded', () => {
    const btn = document.querySelector('.send-message')
    const userInput = document.querySelector('.user-input').value;
    const option = document.querySelector('#mode-select').value;

    console.log('----------')
    console.log('Option: ' + option)

    btn.addEventListener('click', () => {
        switch (option) {
            case 'translate':
                fetch('http://mivs06.gm.fh-koeln.de:7778/api/translate', {
                    method: 'POST',
                    body: userInput
                })
                console.log('Sending data to translate')
                break;
            case 'easy-language':
                fetch('http://mivs06.gm.fh-koeln.de:7778/api/easylanguage', {
                    method: 'POST',
                    body: userInput
                })

                break;
            case 'explain':
                fetch('http://mivs06.gm.fh-koeln.de:7778/api/explain', {
                    method: 'POST',
                    body: userInput
                })
                break;
        }

    })
})