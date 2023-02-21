package com.front.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequiredArgsConstructor
@RequestMapping("/")
public class BoardController {

    /***
     * 게시판정보 화면
     ***/
    @GetMapping(value = "/page/board/board")
    public ModelAndView boardView() {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("content/board/board");
        return mav;
    }

    /***
     * 게시글정보 화면
     ***/
    @GetMapping(value = "/page/board/post/list/{status}")
    public ModelAndView postListView(@PathVariable String status) {
        ModelAndView mav = new ModelAndView();
        mav.addObject("status", status);
        mav.setViewName("content/board/post");
        return mav;
    }

    /***
     * 게시글정보 화면
     ***/
    @GetMapping(value = "/page/board/post/list/{status}/{board_id}")
    public ModelAndView postPageView(@PathVariable String status, @PathVariable String board_id) {
        ModelAndView mav = new ModelAndView();
        mav.addObject("status", status);
        mav.addObject("board_id", board_id);
        mav.setViewName("content/board/postPage");
        return mav;
    }


    /***
     * 게시글등록 화면
     ***/
    @GetMapping(value = "/page/board/post/write/{post_type}/{board_id}")
    public ModelAndView postWriteView(@PathVariable String post_type, @PathVariable String board_id) {
        ModelAndView mav = new ModelAndView();
        mav.addObject("post_type", post_type);
        mav.addObject("board_id", board_id);
        mav.setViewName("content/board/postWrite");
        return mav;
    }

    /***
     * 게시글등록 상세화면
     ***/
    @GetMapping(value = "/page/board/post/view/{post_type}/{post_id}")
    public ModelAndView postView(@PathVariable String post_type, @PathVariable String post_id) {
        ModelAndView mav = new ModelAndView();
        mav.addObject("post_type", post_type);
        mav.addObject("post_id", post_id);
        mav.setViewName("content/board/postView");
        return mav;
    }

    /***
     * 게시글등록 수정화면
     ***/
    @GetMapping(value = "/page/board/post/edit/{post_type}/{post_id}")
    public ModelAndView postEditView(@PathVariable String post_type, @PathVariable String post_id) {
        ModelAndView mav = new ModelAndView();
        mav.addObject("post_type", post_type);
        mav.addObject("post_id", post_id);
        mav.setViewName("content/board/postEdit");
        return mav;
    }

}
