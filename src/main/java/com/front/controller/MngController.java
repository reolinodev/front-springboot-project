package com.front.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequiredArgsConstructor
@RequestMapping("/")
public class MngController {

    /***
     * 코드정보  : /page/mng/code
     ***/
    @GetMapping(value = "/page/mng/code")
    public ModelAndView codeView() {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("content/mng/code");
        return mav;
    }




}
