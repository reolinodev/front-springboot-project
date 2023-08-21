package com.front.controller;

import com.front.domain.Page;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequiredArgsConstructor
@RequestMapping("/")
public class PageController {

    @Value("${api.url}")
    private String apiUrl;


    /***
     * 1.로그인 화면 : /page/login
     * 2.비밀번호 변경 화면 : /page/pwChange
     * 3.메인 화면 : /page/main
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

    @PostMapping("/page/pwChange/{loginId}")
    public ModelAndView pwChangeView(@PathVariable String loginId) {
        ModelAndView mav = new ModelAndView();
        mav.addObject("loginId", loginId);
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

}
