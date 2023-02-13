package com.front.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequiredArgsConstructor
@RequestMapping("/")
public class UserController {


    /***
     * 사용자정보 
     ***/
    @GetMapping(value = "/page/user/user")
    public ModelAndView userView() {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("content/user/user");
        return mav;
    }

    /***
     * 권한정보
     ***/
    @GetMapping(value = "/page/user/auth")
    public ModelAndView authView() {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("content/user/auth");
        return mav;
    }

    /***
     * 사용자권한정보 - 리스트
     ***/
    @GetMapping(value = "/page/user/userAuth")
    public ModelAndView userAuthView() {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("content/user/userAuth");
        return mav;
    }

    /***
     * 사용자권한정보 - 추가
     ***/
    @GetMapping(value = "/page/user/userAuth/write")
    public ModelAndView userAuthWriteView() {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("content/user/userAuthWrite");
        return mav;
    }

}
