$(function() {
    var socket = io()
    $('#chat').submit(function(e) {
        e.preventDefault()
        socket.emit('chat message', {
            msg: $('#message').val(),
            receiver: $('#reciver').val(),
            sender: $('#sender').val()
        })
        $('#message').val('')

        return false
    })
    socket.on('message', function(msg) {
        if (msg == '') {
            const last = document.querySelector('#msgBox').lastElementChild;
            last.scrollIntoView()
        } else {
            console.log(msg)
            $('#display_msg').append($('<p>').text(msg.msg))
            const last = document.querySelector('#display_msg').lastElementChild;
            last.scrollIntoView()
        }
    })
    socket.on('like', function(data) {
        data.like.forEach(function(e) {
            console.log(e)
            if (document.querySelector('.like').id == `${e.LingId}` && data.user.id == e.UserId) {
                $('.like').addClass('text-danger')
            }
        })
    })
})

$('#message').ready(function() {
    console.log('ready')
    const onRealodLast = document.getElementById('msgBox').lastElementChild;
    onRealodLast.scrollIntoView()
})