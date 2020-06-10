$(function() {
    var socket = io()
    $('form').submit(function(e) {
        e.preventDefault()
        socket.emit('chat message', $('#message').val())
        $('#message').val('')
        $('#msgBox').scrollTop

        return false
    })
    socket.on('message', function(msg) {
        $('#display_msg').append($('<p>').text(msg))
        const last = document.querySelector('#display_msg').lastElementChild;
        last.scrollIntoView()
    })
})