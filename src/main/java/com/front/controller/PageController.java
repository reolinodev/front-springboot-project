package com.front.controller;

import com.front.domain.Page;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequiredArgsConstructor
@RequestMapping("/")
public class PageController {

//    private final PostService postService;

    @Value("${api.url}")
    private String apiUrl;


    /***
     * 1.로그인 화면 : /page/login
     * 2.비밀번호 변경 화면 : /page/pwChange
     ***/

    @PostMapping(value = "/")
    public String router(Page page) {
        String url = page.getUrl();
        return "forward:"+ url;
    }

    /**
     * 로그인 화면
     */

    @GetMapping("/page/login")
    public ModelAndView loginView() {
        ModelAndView mav = new ModelAndView();
        mav.addObject("apiUrl", apiUrl);
        mav.setViewName("pages/login");
        return mav;
    }

    /**
     * 비밀번호 화면
     */

    @PostMapping("/page/pwChange")
    public ModelAndView pwChangeView() {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("pages/pwChange");
        return mav;
    }



    /**
     * 메인 화면
     */
    @PostMapping(value = "/page/main")
    public ModelAndView mainView()   {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("content/main");
        return mav;
    }

//    /***
//     * 1.사용자 관리 화면 : /page/user/user
//     * 2.권한 관리 화면 : /page/user/auth
//     * 3.사용자 권한 관리 화면 : /page/user/userAuth
//     * 4.사용자 권한 관리 등록화면 : /page/user/userAuth/write
//     ***/
//    @GetMapping(value = "/page/user/user")
//    public ModelAndView userView() {
//        ModelAndView mav = new ModelAndView();
//        mav.setViewName("content/user/user");
//        return mav;
//    }
//
//    @GetMapping(value = "/page/user/auth")
//    public ModelAndView authView() {
//        ModelAndView mav = new ModelAndView();
//        mav.setViewName("content/user/auth");
//        return mav;
//    }
//
//    @GetMapping(value = "/page/user/userAuth")
//    public ModelAndView userAuthView() {
//        ModelAndView mav = new ModelAndView();
//        mav.setViewName("content/user/userAuth");
//        return mav;
//    }
//
//    @GetMapping(value = "/page/user/userAuth/write")
//    public ModelAndView userAuthWriteView() {
//        ModelAndView mav = new ModelAndView();
//        mav.setViewName("content/user/userAuthWrite");
//        return mav;
//    }
//
//
//    /***
//     * 1.코드 관리 화면 : /page/mng/code
//     ***/
//    @GetMapping(value = "/page/mng/code")
//    public ModelAndView codeView() {
//        ModelAndView mav = new ModelAndView();
//        mav.setViewName("content/mng/code");
//        return mav;
//    }
//
//    @GetMapping(value = "/page/mng/dtHis/{status}")
//    public ModelAndView dtHisView(@PathVariable String status) {
//        ModelAndView mav = new ModelAndView();
//        mav.addObject("status", status);
//        mav.setViewName("content/mng/dtHis");
//        return mav;
//    }
//
//    @GetMapping(value = "/page/mng/dtHis/{dt_gb_cd}/{file_nm}/{strt_dt}")
//    public ModelAndView dtHisDetailView(@PathVariable String dt_gb_cd, @PathVariable String file_nm, @PathVariable String strt_dt) {
//        ModelAndView mav = new ModelAndView();
//        mav.addObject("dtGbCd", dt_gb_cd);
//        mav.addObject("fileNm", file_nm);
//        mav.addObject("strtDt", strt_dt);
//        mav.setViewName("content/mng/dtHisDetail");
//        return mav;
//    }
//
//
//    /***
//     * 1.메뉴 관리 화면 : /page/menu/menu
//     * 2.권한별 메뉴 관리 화면 : /page/menu/authMenu
//     ***/
//    @GetMapping(value = "/page/menu/menu")
//    public ModelAndView menuView() {
//        ModelAndView mav = new ModelAndView();
//        mav.setViewName("content/menu/menu");
//        return mav;
//    }
//
//    @GetMapping(value = "/page/menu/authMenu")
//    public ModelAndView authMenuView() {
//        ModelAndView mav = new ModelAndView();
//        mav.setViewName("content/menu/authMenu");
//        return mav;
//    }
//
//    /***
//     * 1.게시판 관리 화면 : /page/board/board
//     * 2.게시글 관리 화면 : /page/board/post
//     * 3.게시글 작성 화면 : /page/board/post/write
//     * 4.게시글 보기 화면 : /page/board/post/view/{post_id}
//     * 3.게시글 수정 화면 : /page/board/post/edit/{post_id}
//     ***/
//    @GetMapping(value = "/page/board/board")
//    public ModelAndView boardView() {
//        ModelAndView mav = new ModelAndView();
//        mav.setViewName("content/board/board");
//        return mav;
//    }
//
//    @GetMapping(value = "/page/board/post/{status}")
//    public ModelAndView postView(@PathVariable String status) {
//        ModelAndView mav = new ModelAndView();
//        mav.addObject("boardKey", "");
//        mav.addObject("status", status);
//        mav.setViewName("content/board/post");
//        return mav;
//    }
//
//    @GetMapping(value = "/page/board/post/{status}/{board_idntf_key}")
//    public ModelAndView postPage(@PathVariable String board_idntf_key, @PathVariable String status) {
//        ModelAndView mav = new ModelAndView();
//        mav.addObject("boardKey", board_idntf_key);
//        mav.addObject("status", status);
//        mav.setViewName("content/board/post");
//        return mav;
//    }
//
//    @GetMapping(value = "/page/board/post/write")
//    public ModelAndView postWriteView() {
//        ModelAndView mav = new ModelAndView();
//        mav.addObject("boardKey", "");
//        mav.setViewName("content/board/postWrite");
//        return mav;
//    }
//
//    @GetMapping(value = "/page/board/post/write/{board_idntf_key}")
//    public ModelAndView postWritePage(@PathVariable String board_idntf_key) {
//        ModelAndView mav = new ModelAndView();
//        mav.addObject("boardKey", board_idntf_key);
//        mav.setViewName("content/board/postWrite");
//        return mav;
//    }
//
//    @GetMapping(value = "/page/board/post/view/{post_idntf_key}")
//    public ModelAndView postEditView(@PathVariable String post_idntf_key) {
//        ModelAndView mav = new ModelAndView();
//
//        PostEntity data = postService.getPostInfo(post_idntf_key);
//        postService.updatePostCnt(post_idntf_key);
//
//        mav.addObject("boardKey", "");
//        mav.addObject("data", data);
//        mav.setViewName("content/board/postView");
//        return mav;
//    }
//
//    @GetMapping(value = "/page/board/post/view/{post_idntf_key}/{board_idntf_key}")
//    public ModelAndView postEditPage(@PathVariable String post_idntf_key, @PathVariable String board_idntf_key) {
//        ModelAndView mav = new ModelAndView();
//
//        PostEntity data = postService.getPostInfo(post_idntf_key);
//        postService.updatePostCnt(post_idntf_key);
//
//        mav.addObject("boardKey", board_idntf_key);
//        mav.addObject("data", data);
//        mav.setViewName("content/board/postView");
//        return mav;
//    }
//
//    @GetMapping(value = "/page/board/post/edit/{post_idntf_key}")
//    public ModelAndView postEditorView(@PathVariable String post_idntf_key) {
//        ModelAndView mav = new ModelAndView();
//
//        PostEntity data = postService.getPostInfo(post_idntf_key);
//
//        mav.addObject("boardKey", "");
//        mav.addObject("data", data);
//        mav.setViewName("content/board/postEdit");
//        return mav;
//    }
//
//    @GetMapping(value = "/page/board/post/edit/{post_idntf_key}/{board_idntf_key}")
//    public ModelAndView postEditorPage(@PathVariable String post_idntf_key, @PathVariable String board_idntf_key) {
//        ModelAndView mav = new ModelAndView();
//
//        PostEntity data = postService.getPostInfo(post_idntf_key);
//
//        mav.addObject("boardKey", board_idntf_key);
//        mav.addObject("data", data);
//        mav.setViewName("content/board/postEdit");
//        return mav;
//    }
//
//    /***
//     * 1.마스터DB 조회 : /page/shop/master
//     * 2.마스터DB 상세 조회 : /page/shop/master/{mastKey}
//     * 3.계열사별 매장정보 조회 : /page/shop/shop
//     * 4.계열사별 매장정보 상세 조회 : /page/shop/shop/detail
//     ***/
//    @GetMapping(value = "/page/shop/master/{status}")
//    public ModelAndView masterView(@PathVariable String status) {
//        ModelAndView mav = new ModelAndView();
//        mav.addObject("status", status);
//        mav.setViewName("content/shop/master");
//        return mav;
//    }
//
//    @GetMapping(value = "/page/shop/master/detail/{mastKey}")
//    public ModelAndView masterDetailView(@PathVariable String mastKey) {
//        ModelAndView mav = new ModelAndView();
//        mav.addObject("mast_key", mastKey);
//        mav.setViewName("content/shop/masterDetail");
//        return mav;
//    }
//
//
//    @GetMapping(value = "/page/shop/shop/{status}")
//    public ModelAndView shopView(@PathVariable String status) {
//        ModelAndView mav = new ModelAndView();
//        mav.addObject("status", status);
//        mav.setViewName("content/shop/shop");
//        return mav;
//    }
//
//    @GetMapping(value = "/page/shop/shop/detail/{idntfKey}")
//    public ModelAndView shopDetailView(HttpServletRequest request) {
//        ModelAndView mav = new ModelAndView();
//        mav.addObject("mast_key", request.getParameter("mast_key"));
//        mav.addObject("corp_svc_cd",  request.getParameter("corp_svc_cd"));
//        mav.addObject("idntf_key", request.getParameter("idntf_key"));
//        mav.setViewName("content/shop/shopDetail");
//        return mav;
//    }
}
