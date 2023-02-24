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
     * 게시글정보 화면(개별)
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


    /***
     * FAQ정보 화면
     ***/
    @GetMapping(value = "/page/board/faq/list/{status}")
    public ModelAndView faqView(@PathVariable String status) {
        ModelAndView mav = new ModelAndView();
        mav.addObject("status", status);
        mav.setViewName("content/board/faq");
        return mav;
    }

    /***
     * FAQ 정보화면(개별)
     ***/
    @GetMapping(value = "/page/board/faq/list/{status}/{board_id}")
    public ModelAndView faqPageView(@PathVariable String status, @PathVariable String board_id) {
        ModelAndView mav = new ModelAndView();
        mav.addObject("status", status);
        mav.addObject("board_id", board_id);
        mav.setViewName("content/board/faqPage");
        return mav;
    }


    /***
     * FAQ 등록화면
     ***/
    @GetMapping(value = "/page/board/faq/write")
    public ModelAndView faqWriteView() {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("content/board/faqWrite");
        return mav;
    }

    /***
     * FAQ 수정화면
     ***/
    @GetMapping(value = "/page/board/faq/edit/{faq_id}")
    public ModelAndView faqEditView(@PathVariable String faq_id) {
        ModelAndView mav = new ModelAndView();
        mav.addObject("faq_id", faq_id);
        mav.setViewName("content/board/faqEdit");
        return mav;
    }

    /***
     * QNA 정보화면
     ***/
    @GetMapping(value = "/page/board/qna/list/{status}")
    public ModelAndView qnaView(@PathVariable String status) {
        ModelAndView mav = new ModelAndView();
        mav.addObject("status", status);
        mav.setViewName("content/board/qna");
        return mav;
    }

    /***
     * QNA 정보화면(개별)
     ***/
    @GetMapping(value = "/page/board/qna/list/{status}/{board_id}")
    public ModelAndView qnaPageView(@PathVariable String status, @PathVariable String board_id) {
        ModelAndView mav = new ModelAndView();
        mav.addObject("status", status);
        mav.addObject("board_id", board_id);
        mav.setViewName("content/board/qnaPage");
        return mav;
    }


    /***
     * QNA 등록 화면
     ***/
    @GetMapping(value = "/page/board/qna/write/{board_id}")
    public ModelAndView postWriteView(@PathVariable String board_id) {
        ModelAndView mav = new ModelAndView();
        mav.addObject("board_id", board_id);
        mav.setViewName("content/board/qnaWrite");
        return mav;
    }


    /***
     * QNA 수정 화면
     ***/
    @GetMapping(value = "/page/board/qna/edit/{qna_id}")
    public ModelAndView qnaEditView(@PathVariable String qna_id) {
        ModelAndView mav = new ModelAndView();
        mav.addObject("qna_id", qna_id);
        mav.setViewName("content/board/qnaEdit");
        return mav;
    }

    /***
     * QNA 상세 화면
     ***/
    @GetMapping(value = "/page/board/qna/detail/{qna_id}")
    public ModelAndView qnaDetailView(@PathVariable String qna_id) {
        ModelAndView mav = new ModelAndView();
        mav.addObject("qna_id", qna_id);
        mav.setViewName("content/board/qnaDetail");
        return mav;
    }


    /***
     * QNA 답변화면
     ***/
    @GetMapping(value = "/page/board/qna/answer/{qna_id}")
    public ModelAndView qnaAnswerView(@PathVariable String qna_id) {
        ModelAndView mav = new ModelAndView();
        mav.addObject("qna_id", qna_id);
        mav.setViewName("content/board/qnaAnswer");
        return mav;
    }

}
