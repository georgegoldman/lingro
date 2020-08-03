// $(document).ready(function() {
//     $('.ling').on('submit', function(evt) {
//         evt.preventDefault()
//         $.ajax({
//             url: '/ling',
//             type: 'POST',
//             success: function(data) {
//                 if (data.success) {
//                     alert(data.msg)
//                 } else {
//                     alert('not linged')
//                 }
//             },
//             error: function() {
//                 alert('there was a problem')
//             }
//         })
//     })

// })

// $(function() {
//     var socket = io()
//     document.getElementById('ling').addEventListener('click', function(e) {
//         e.preventDefault()
//         socket.on('like', function(data) {
//             alert(data.msg)
//         })
//     })
// })



$(window).on('load', function() {
    fetch(`${window.origin}/testFetch`)
        .then(function(response) {
            if (response.status !== 200) {
                console.log(response.status)
                return
            }
            response.json()
                .then(function(data) {
                    // data.like.forEach(function(e) {
                    //     console.log(e)
                    //     if (document.querySelector('.like').id == `${e.LingId}` && data.user.id == e.UserId) {
                    //         $('.like').addClass('text-danger')
                    //     }
                    // })
                })
        })
})