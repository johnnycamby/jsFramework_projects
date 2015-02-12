/**
 * Created by johnny on 8/22/2014.
 */


(function(blog, $, undefined){

   'use strict';

    blog.posts = [];
    blog.categories = [];
    blog.channel = $(document);

    blog.init = function(){

        blog.getPosts();

        // =========== subscribing to events ==============
        blog.channel.on('postsUpdated', blog.setPosts);
        blog.channel.on('postsUpdated', blog.displayList);

        blog.channel.on('postsDisplayed', blog.setDefault);
        blog.channel.on('postsFiltered', blog.setDefault);


        $('.list-group').on('click', 'a', blog.changePost);
        $('.btn-group').on('change', 'input', blog.changeFilter);
    };

    blog.getPosts = function(callback){

        var url = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent("select * from rss where url = 'http://tech.pro/rss/blogs'") + '&format=json&callback=?';

        $.getJSON(
            url,
            function(data){

                var posts = data.query.results.item; // an array/multi-dimension

                posts = $.map(posts, function(post){ // use map to iterate thru 'posts' and transform it to post
                   // post.categories = post.category.join(', ');

                    return post;
                });

                // ============= Publishing =================
                blog.channel.trigger('postsUpdated', [posts]);

                if(callback){
                    callback(posts);
                }
            });
    };

    blog.setPosts = function(e, posts){

        blog.posts = posts;
    };

    blog.displayList = function(e, posts){

        var template = _.template($('#blog-post').html()),
            html = '';

        posts = posts || blog.posts;
        $.each(posts, function(_, post){
            html += template({
                post : post
            });
        });
        $('.list-group').html(html);

        blog.channel.trigger('postsDisplayed', [posts]);
    };

    blog.setDefault = function(){

        var $active = $('.list-group-item.active:not(.fade-out)');

        if(!$active.length){
            $active = $('.list-group-item:not(.fade-out):first');
            blog.setActive($active);
            blog.displayDetail($active.attr('href'));
        }

    };

    blog.setActive = function($element){

        $('.list-group-item.active').removeClass('active');
        $element.addClass('active');
    };

    blog.changePost = function(e){

        var $post = $(this);

        e.preventDefault();
        blog.setActive($post);

        blog.displayDetail($post.attr('href'));
    };

    blog.changeFilter = function(){

        var $group = $(this).closest('.btn-group'),
            $inputs = $group.find('input');

        blog.categories = $inputs.map(function(){
            return $(this).is(":checked") ? $(this).data("category") : null;
        }).get();

        blog.filterList(blog.categories);
    };

    blog.filterList = function(categories){
        categories = categories || blog.categories;

        $('.list-group-item').each(function(){
            var found = !categories.length,
                $this = $(this);

            if(!found){
                $.each(categories, function(i, category){
                    var tags = $this.data("categories");

                    if(~$.inArray(category, tags)){
                        found = true;
                        return false;
                    }
                });
            }

            if(found){
                $this.removeClass("fade-out").fadeIn();
            }else{
                $this.addClass("fade-out").fadeOut();
            }
        });

        blog.channel.trigger("postsFiltered");
    };

    blog.displayDetail = function(url){

        var post = $.grep(blog.posts, function(post){

            return post.link === url;
        })[0];

        $('.panel-title').html(post.title);
        $('.panel-body').html(post.description);
    };


}(window.blog = window.blog || {} , jQuery));

blog.init();