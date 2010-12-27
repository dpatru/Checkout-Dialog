; from http://elarson.posterous.com/some-emacs-tips

(defun foo-web-server ( )   
   (interactive)   
   (setq cmd "dev_appserver.py .")
   (comint-simple-send (make-comint "gae" "bash") cmd))   
   
(defun foo-tdaemon ( )   
   (interactive)   
   (setq cmd "echo \"y\" | tdaemon --test-program=nosetests --custom-args=\"--with-doctest --with-gae --gae-lib-root=$gae\"") 
   (comint-simple-send (make-comint "test" "bash") cmd))   
   
(defun foo-gorun ( )
  (interactive)
  (setq cmd "gorun.py gorun_settings.py")
  (comint-simple-send (make-comint "gorun" "bash") cmd))

(defun foo-start-all ( )   
   (interactive)   
   (foo-web-server)
   (foo-tdaemon)
   (foo-gorun)
   )

(foo-start-all)
