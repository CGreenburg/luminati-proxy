// LICENSE_CODE ZON ISC
'use strict'; /*jslint react:true, es6:true*/
import etask from 'hutil/util/etask';
import ajax from 'hutil/util/ajax';
import React from 'react';
import {Modal, Loader} from './common.js';
import Pure_component from '../../www/util/pub/pure_component.js';
import $ from 'jquery';

class Index extends Pure_component {
    constructor(props){
        super(props);
        this.state = {desc: '', sending: false};
    }
    desc_changed(e){ this.setState({desc: e.target.value}); }
    click_cancel(){ this.setState({desc: ''}); }
    detect_browser(){
        let browser = 'unknown';
        if ((!!window.opr && !!window.opr.addons) || !!window.opera ||
            navigator.userAgent.indexOf(' OPR/')>=0)
        {
            browser = 'opera';
        }
        else if (typeof InstallTrigger!=='undefined')
            browser = 'firefox';
        else if (/*@cc_on!@*/false || !!document.documentMode)
            browser = 'IE';
        else if (!!window.StyleMedia)
            browser = 'Edge';
        else if (!!window.chrome && !!window.chrome.webstore)
            browser = 'chrome';
        return browser;
    }
    click_report(){
        const desc = this.state.desc;
        const _this = this;
        return etask(function*(){
            this.on('uncaught', ()=>{ _this.setState({sending: false}); });
            _this.setState({sending: true});
            yield window.fetch('/api/report_bug', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({desc, browser: _this.detect_browser()}),
            });
            _this.setState({sending: false});
            window.setTimeout(()=>$('#thanks_modal').modal(), 500);
        });
    }
    render(){
        return (
            <div className="lpm report_bug">
              <Loader show={this.state.sending}/>
              <Modal title="Report a bug" id="report_bug_modal"
                ok_btn_title="Report"
                click_ok={this.click_report.bind(this)}
                cancel_clicked={this.click_cancel.bind(this)}>
                <div className="desc">Briefly describe your issue below and
                  our support engineer will contact you shortly:</div>
                <textarea placeholder="Describe your issue here"
                  value={this.state.desc}
                  onChange={this.desc_changed.bind(this)}/>
              </Modal>
              <Thanks_modal/>
            </div>
        );
    }
}

const Thanks_modal = ()=>(
    <Modal title="Report has been sent" id="thanks_modal"
      no_cancel_btn>
      <h4>You issue in being handled! We will be in touch as soon
        as possible.</h4>
    </Modal>
);

export default Index;
