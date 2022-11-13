var correctImg = '<div class="showAnswerTickMark showAns"><img  src="assets/images/tikMark.png" /></div>';
var incorrectImg = '<div class="showAnswerCrossMark showAns"><img src="assets/images/crossMark.png" /></div>';
var isMusic1Playing = false;
var isMusic2Playing = false;
var $audio1 = $("#audioPlayer1");
var $audio2 = $("#audioPlayer2");
var slider = document.getElementById("myRange");
var lastAudio = 0;
var totalItems = $('.item').length;
var currentIndex = $('div.active').index() + 1;
let totalSelected = $('.drag-drop').length

/************************************************************************************** */
function mouseup(index) {
	$(index).css({
		'background-color': 'rgb(238, 244, 249)'
	})
	setTimeout(function () {
		$(index).css({
			'background-color': '#fff'
		})
	}, 1000);
}

function checkall() {
	if (totalSelected == $('.selected').length) {
		$('.showAnsBtn').addClass('disabled');
	}
}

var drag_pos = {
	x: 0,
	y: 0
}

function dragging(e) {
	let scale = window.basePage.scale;
	drag_pos.x += e.dx;
	drag_pos.y += e.dy;
	$(e.target).children()[1].style.visibility = 'hidden'
	e.target.style.transform = 'translate(' + drag_pos.x / scale + 'px, ' + drag_pos.y / scale + 'px)';
}

function dragged(e) {
	drag_pos.x = 0;
	drag_pos.y = 0;
	e.target.style.transform = 'translate(0px, 0px)';
	if ($(e.target).hasClass('selected')) {
		fnAudio($('.correctAnsAudio'));
	} else {
		fnAudio($('.incorrectAnsAudio'));
		$(e.target).addClass('animate__animated animate__wobble')
		setTimeout(function () {
			$(e.target).removeClass("animate__animated animate__wobble");
		}, 1000)
	}
	$(e.target).children()[1].style.visibility = 'visible'
	e.target.style.zIndex='0'
}
interact('.draggable')
	.draggable({

		// enable inertial throwing
		inertia: true,
		// keep the element within the area of it's parent

		// enable autoScroll
		autoScroll: true,

		listeners: {
			// call this function on every dragmove event
			move: dragMoveListener,

			// call this function on every dragend event
			end: dragged,
			move: dragging,
		}
	})

function dragMoveListener(event) {
	var target = event.target
	// keep the dragged position in the data-x/data-y attributes
	var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
	var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

	// translate the element
	target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'
	// update the posiion attributes
	target.setAttribute('data-x', x)
	target.setAttribute('data-y', y)
}

window.dragMoveListener = dragMoveListener

interact('.heat').dropzone({
	accept: '#yes-drop2, #yes-drop4, #yes-drop5, #yes-drop6, #yes-drop8',
	overlap: 0.75,


	ondropactivate: function (event) {
		event.target.classList.add('drop-active')
	},
	ondragenter: function (event) {
		// mouseup(event.target)
	},
	ondragleave: function (event) {
	},
	ondrop: function (event) {
		mouseup(event.target)
		let clone = event.relatedTarget;
		let clone1 = $(clone).clone().children()[0];
		$('#inner-dropzone1').append(clone1);
		$(clone1).addClass('animate__animated animate__pulse')
		$(event.relatedTarget).addClass('selected')
		checkall();
		fnAudio($('.correctAnsAudio'));
	},
	ondropdeactivate: function (event) {
		event.target.classList.remove('drop-active')
		event.target.classList.remove('drop-target')
	}
})
interact('.noheat').dropzone({
	accept: '#yes-drop1, #yes-drop3, #yes-drop7, #yes-drop9, #yes-drop10',
	overlap: 0.75,
	ondropactivate: function (event) {
		event.target.classList.add('drop-active')
	},
	ondragenter: function (event) {
		// mouseup(event.target)
	},
	ondragleave: function (event) {
	},
	ondrop: function (event) {
		mouseup(event.target)
		let clone = event.relatedTarget;
		let clone1 = $(clone).clone().children()[0];
		$('#inner-dropzone2').append(clone1);
		$(clone1).addClass('animate__animated animate__pulse')
		$(event.relatedTarget).addClass('selected');
		checkall();
		fnAudio($('.correctAnsAudio'));
	},
	ondropdeactivate: function (event) {
		event.target.classList.remove('drop-active')
		event.target.classList.remove('drop-target')
	}
})

interact('.drag-drop')
	.draggable({
		inertia: true,
		modifiers: [
			interact.modifiers.restrictRect({
				restriction: 'parent',
				endOnly: true
			})
		],
		autoScroll: true,
		listeners: {
			start: function (e) {
				fnAudio($(e.target).children()[0])
				
    	
					var maxZ = Math.max.apply(null, 
						 $.map($('body > *'), function(e,n) {
							if ($(e).css('position') != 'static')
							  return parseInt($(e).css('z-index')) || 1;
					  }));
					
							 e.target.style.zIndex = maxZ + 99999999; 
							 e.target.style.position = 'relative'; 
						
			},
			move: dragMoveListener,
			end: dragged,
			move: dragging,
		}
	})


/************************************************************************************** */

function fnTemplate4_v1(_div) {
	var slide = $(_div);
	var currID;
	$audio1[0].pause();
	$audio1[0].currentTime = 0;
	slider.value = 0;
	$audio1[0].pause();
	$audio1[0].removeEventListener('timeupdate', fnUpdateTimer);
	$('#pButton .playImg').show();
	$('#pButton .pauseImg').hide();

	setAudio($(slide).attr('data-audioSrc'));
	$('.question').css({
		'background-color': '#ffffff',
		'color': '#000000'
	}).removeClass('selected');
	$('.optClick').css('cursor', 'default');
}




function fnReloadAll() {
	$('.drag-drop').css({
		'visibility': 'visible'
	})
	
	$('.caption').css({'visibility':'visible'});
	$('.drag-drop').removeClass('selected')
	$('.question').css({
		'border': '2px solid #ffffff',
		'visibility': 'visible'
	}).removeClass('selected disabled');
	$('.showAnsBtn').removeClass('disabled');
	$('#inner-dropzone1').empty();
	$('#inner-dropzone2').empty();
	stopAudio();

	fnTemplate4_v1($('div.active'));
}

function fnReloadScreen() {
	$('#Heat').removeClass('animate__animated animate__wobble animate__pulse');
	$('div.active').find('.question').removeClass('completed').addClass('notCompleted');
	$('div.active').find('.question').css({
		'border': '2px solid #ffffff',
		'visibility': 'visible'
	}).removeClass('selected disabled');
	stopAudio();
	fnTemplate4_v1($('div.active'));
}

function fnAudio(obj) {
	var titleAudioPath = $(obj).attr('data-audioSrc');
	$audio2[0].setAttribute('src', titleAudioPath);
	$audio2[0].load();
	var playPromise = $audio2[0].play();

	if (playPromise !== undefined) {
		playPromise.then(function (value) {
				$audio1[0].pause();
				$('#pButton .playImg').show();
				$('#pButton .pauseImg').hide();
			})
			.catch(function (error) {
			});
	}
}


function showAns() {
	$('#inner-dropzone1').empty();
	$('#inner-dropzone2').empty();
	$('.caption').css({'visibility':'hidden'});
	if ($('.showAnsBtn').hasClass('disabled')) {
		return false;
	}
	$('.imgHeat').each(function () {
		let photos = $(this).clone()
		$('#inner-dropzone1').append(photos);
	});
	$('.imgNoHeat').each(function () {
		let photos2 = $(this).clone()
		$('#inner-dropzone2').append(photos2)

	});
	stopAudio();
	$audio1[0].pause();
	$audio2[0].pause();
	$('div.active').find('.drag-drop').css('visibility', 'hidden');
	$('div.active').find('.optClick').each(function () {
		$(this).html('<img class="ansImage" src=' + $(this).attr('data-Answer') + ' />').addClass('filled').append(correctImg);
	});
	$(this).addClass('disabled');
}

function setAudio(_src) {
	if (_src == "") {
		$('.controlsDiv').addClass('hide');
	} else {
		$('.controlsDiv').removeClass('hide');
	}
	$audio1[0].setAttribute('src', _src);
	$audio1[0].load();
}

function fnTitleAudioClick(obj) {
	if ($(obj).hasClass('hide')) {
		return false;
	}
	$audio1[0].pause();
	$audio1[0].removeEventListener('timeupdate', fnUpdateTimer);
	$('#pButton .playImg').show();
	$('#pButton .pauseImg').hide();
	var titleAudioPath = $(obj).attr('data-audioSrc');
	$audio2[0].setAttribute('src', titleAudioPath);
	$audio2[0].load();
	$audio2[0].play();
	isMusic1Playing = false;
	isMusic2Playing = true;
}

function fnUpdateTimer() {
	var progressValue = Math.round(($audio1[0].currentTime / $audio1[0].duration) * 100);

	slider.value = progressValue;
}

function fnStartAudio(_state) {
	$audio2[0].pause();
	if (_state == 'play') {
		$('#pButton .playImg').hide();
		$('#pButton .pauseImg').show();
		$audio1[0].play();
		isMusic1Playing = true;
	} else {
		$('#pButton .playImg').show();
		$('#pButton .pauseImg').hide();
		$audio1[0].pause();
		lastAudio = 0;
		isMusic1Playing = false;
	}
	$audio1[0].addEventListener('timeupdate', fnUpdateTimer);
}

function stopAudio() {
	$audio1[0].pause();
	$('#pButton .playImg').show();
	$('#pButton .pauseImg').hide();
	$audio1[0].currentTime = 0;
	slider.value = 0;
	isMusic1Playing = false;
	$audio2[0].pause();
	isMusic2Playing = false;
	lastAudio = 0;
}


function fnSetPlayer() {
	if (currentIndex == 1) {
		$('.backBtn').addClass('disabled');
	}

	if (totalItems == 1) {
		$('.navigationControls, .nextBtn, .reloadBtnScreen, .backBtn, .pageNumber').addClass('hide');
	}

	if ($('.title').attr('data-audioSrc') == "") {
		$('.title').addClass('hide');
		$('.headingTitle').removeClass('col-xs-10').addClass('col-xs-11');
	}

	$audio1[0].addEventListener('playing', function () {
		lastAudio = 1;
		isMusic1Playing = true;
	});

	$audio2[0].addEventListener('playing', function () {
		lastAudio = 2;
		isMusic2Playing = true;
	});

	$audio1[0].addEventListener('pause', function () {
		isMusic1Playing = false;
	});

	$audio2[0].addEventListener('pause', function () {
		isMusic2Playing = false;
	});

	$audio1[0].addEventListener('ended', function () {
		lastAudio = 0;
		isMusic1Playing = false;
		$audio1[0].currentTime = 0;
		slider.value = 0;
		$audio1[0].pause();
		$audio1[0].removeEventListener('timeupdate', fnUpdateTimer);
		$('#pButton .playImg').show();
		$('#pButton .pauseImg').hide();
	});

	$audio2[0].addEventListener('ended', function () {
		lastAudio = 0;
	});

	slider.addEventListener("input", function () {
		// console.log(">> input "+slider.value);
		// $audio1[0].pause();
		$audio1[0].removeEventListener('timeupdate', fnUpdateTimer);
		var setTime = Math.round((slider.value * $audio1[0].duration) / 100);
		$audio1[0].currentTime = setTime;
	}, false);

	slider.addEventListener("change", function () {
		// console.log("change >> "+isMusic1Playing);
		if (isMusic1Playing) {
			$audio1[0].play();
			$audio1[0].addEventListener('timeupdate', fnUpdateTimer);
		}
	}, false);

	$('#myCarousel').on('slid.bs.carousel', function () {
		currentIndex = $('div.active').index() + 1;
		$('.pageNumber').html(currentIndex + ' of ' + totalItems);
		if (currentIndex == 1) {
			$('.backBtn').addClass('disabled');
		} else {
			$('.backBtn').removeClass('disabled');
		}

		if (currentIndex == totalItems) {
			$('.nextBtn').addClass('disabled');
		} else {
			$('.nextBtn').removeClass('disabled');
		}
		stopAudio();

		// need to edit template function name here:
		fnTemplate4_v1($('div.active'));
	});
}


