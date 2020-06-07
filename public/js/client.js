var socket = io()

$(() => {
    $("#send").click(() => {
        sendMessage({
            name: $("#chatingwith").val(),
            message: $("#message").val()
        })
        getMessages()
    })

    function addMessages(message) {
        `<h4>${message.name}</h4>
         <p>${message.message}</p>`
    }

    function getMessages() {
        $.get('http://localhost:5000/chatRoom', (data) => {
            data.forEach(addMessages)
        })
    }

    function sendMessage(message) {
        $.post('http://localhost:5000/chatRoom', message)
    }
})