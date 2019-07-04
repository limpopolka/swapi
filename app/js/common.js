$(function() {
	var vue = new Vue({
		el: '#app',
		data: {
			searching: false, //для инициализации процесса поиска
			loading: false,
			checkbox: 'people',
			nextUrl: "https://swapi.co/api/people",
			show: [], //выводим этот массив в таблицу
			search: '' //строка поиска
		},
		watch:{
			search: function(){
				if(this.search){
					this.searching = true;
					$.ajax({
						url: "https://swapi.co/api/"+ this.checkbox +"/?search=" + this.search,
						success: function(response){
							vue.show.splice(0, vue.show.length);
							response.results.forEach(function(item, i, arr){
								vue.show.push(item);
							});

							vue.nextUrl = "https://swapi.co/api/people/";
						},
						error: function(error){
							console.log(error);
						}
					});
					}else{
						vue.searching = false;
						vue.show.splice(0, vue.show.length);
						vue.nextUrl = "https://swapi.co/api/" + this.checkbox;
						vue.getAll();
					}
				}		
		},
		methods: {
			getAll: function(){
				$.ajax({
					url: this.nextUrl,
					success: function(response){
						vue.show = vue.show.concat(response.results);
						vue.nextUrl = response.next;
					},
					error: function(error){
						console.log(error);
					}
				});
			},
			onScroll: function(event){

				var wrapper = event.target;
				var list = wrapper.firstElementChild;

				var scrollTop = wrapper.scrollTop;
				var wrapperHeight = wrapper.offsetHeight;
				var listHeight = list.offsetHeight;

				var diffHeight = listHeight - wrapperHeight;


				if (scrollTop >= diffHeight && this.searching == false) {
					this.getAll();
				}
			},
			chooseItem: function(choose){
				this.show.splice(0, vue.show.length);
				this.nextUrl = "https://swapi.co/api/" + choose;
				this.checkbox = choose;
				this.getAll();
				this.show.splice(0, vue.show.length);
			}

			
		},
		created: function(){
			this.getAll();
		},

	});
});
