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
    @GetMapping(value = "/page/board/post/list/{status}/{boardId}")
    public ModelAndView postPageView(@PathVariable String status, @PathVariable Long boardId) {
        ModelAndView mav = new ModelAndView();
        mav.addObject("status", status);
        mav.addObject("boardId", boardId);
        mav.setViewName("content/board/postPage");
        return mav;
    }


    /***
     * 게시글등록 화면
     ***/
    @GetMapping(value = "/page/board/post/write/{postType}/{boardId}")
    public ModelAndView postWriteView(@PathVariable String postType, @PathVariable Long boardId) {
        ModelAndView mav = new ModelAndView();
        mav.addObject("postType", postType);
        mav.addObject("boardId", boardId);
        mav.setViewName("content/board/postWrite");
        return mav;
    }

    /***
     * 게시글등록 상세화면
     ***/
    @GetMapping(value = "/page/board/post/view/{postType}/{postId}")
    public ModelAndView postView(@PathVariable String postType, @PathVariable Long postId) {
        ModelAndView mav = new ModelAndView();
        mav.addObject("postType", postType);
        mav.addObject("postId", postId);
        mav.setViewName("content/board/postView");
        return mav;
    }

    /***
     * 게시글등록 수정화면
     ***/
    @GetMapping(value = "/page/board/post/edit/{postType}/{postId}")
    public ModelAndView postEditView(@PathVariable String postType, @PathVariable Long postId) {
        ModelAndView mav = new ModelAndView();
        mav.addObject("postType", postType);
        mav.addObject("postId", postId);
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
    @GetMapping(value = "/page/board/faq/list/{status}/{boardId}")
    public ModelAndView faqPageView(@PathVariable String status, @PathVariable Long boardId) {
        ModelAndView mav = new ModelAndView();
        mav.addObject("status", status);
        mav.addObject("boardId", boardId);
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
    @GetMapping(value = "/page/board/faq/edit/{faqId}")
    public ModelAndView faqEditView(@PathVariable String faqId) {
        ModelAndView mav = new ModelAndView();
        mav.addObject("faqId", faqId);
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
    @GetMapping(value = "/page/board/qna/list/{status}/{boardId}")
    public ModelAndView qnaPageView(@PathVariable String status, @PathVariable Long boardId) {
        ModelAndView mav = new ModelAndView();
        mav.addObject("status", status);
        mav.addObject("boardId", boardId);
        mav.setViewName("content/board/qnaPage");
        return mav;
    }


    /***
     * QNA 등록 화면
     ***/
    @GetMapping(value = "/page/board/qna/write/{boardId}")
    public ModelAndView postWriteView(@PathVariable Long boardId) {
        ModelAndView mav = new ModelAndView();
        mav.addObject("boardId", boardId);
        mav.setViewName("content/board/qnaWrite");
        return mav;
    }


    /***
     * QNA 수정 화면
     ***/
    @GetMapping(value = "/page/board/qna/edit/{qnaId}")
    public ModelAndView qnaEditView(@PathVariable String qnaId) {
        ModelAndView mav = new ModelAndView();
        mav.addObject("qnaId", qnaId);
        mav.setViewName("content/board/qnaEdit");
        return mav;
    }

    /***
     * QNA 상세 화면
     ***/
    @GetMapping(value = "/page/board/qna/detail/{qnaId}")
    public ModelAndView qnaDetailView(@PathVariable String qnaId) {
        ModelAndView mav = new ModelAndView();
        mav.addObject("qnaId", qnaId);
        mav.setViewName("content/board/qnaDetail");
        return mav;
    }


    /***
     * QNA 답변화면
     ***/
    @GetMapping(value = "/page/board/qna/answer/{qnaId}")
    public ModelAndView qnaAnswerView(@PathVariable String qnaId) {
        ModelAndView mav = new ModelAndView();
        mav.addObject("qnaId", qnaId);
        mav.setViewName("content/board/qnaAnswer");
        return mav;
    }

}
