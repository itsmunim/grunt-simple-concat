#### grunt-simple-concat

##### How to use

- Grunt Config

```
simpleConcat: {
  main: {
    src: 'app/index.html',
    cwd: '/Users/amd/projects/ams/', // working dir absolute path
    dest: 'dist'
  }
}
```

- Then just add `simple` tags with target name after `:` in your html. And enclose your script tags inside `simple` tags.

Example-

```
<!-- simple:vendor -->
<script src="node_modules/jquery/dist/jquery.js"></script>
<script src="node_modules/angular/angular.js"></script>
<script src="node_modules/bootstrap/dist/js/bootstrap.js"></script>
<script src="node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js"></script>
<script src="node_modules/angular-animate/angular-animate.js"></script>
<script src="node_modules/angular-cookies/angular-cookies.js"></script>
<script src="node_modules/angular-messages/angular-messages.js"></script>
<script src="node_modules/angular-resource/angular-resource.js"></script>
<script src="node_modules/angular-route/angular-route.js"></script>
<script src="node_modules/angular-sanitize/angular-sanitize.js"></script>
<script src="node_modules/angular-touch/angular-touch.js"></script>
<script src="node_modules/jquery-ui-dist/jquery-ui.js"></script>
<script src="node_modules/ng-file-upload/dist/ng-file-upload.js"></script>
<script src="node_modules/adal-angular/lib/adal.js"></script>
<script src="node_modules/adal-angular/lib/adal-angular.js"></script>
<script src="node_modules/moment/moment.js"></script>
<script src="node_modules/underscore/underscore.js"></script>
<script src="node_modules/ng-idle/angular-idle.js"></script>
<script src="node_modules/ui-select/dist/select.js"></script>
<script src="node_modules/select2/dist/js/select2.js"></script>
<script src="node_modules/validate.js/validate.js"></script>
<script src="node_modules/angular-ui-sortable/dist/sortable.js"></script>
<script src="node_modules/chart.js/dist/Chart.js"></script>
<script src="node_modules/jquery-tokeninput/dist/js/jquery-tokeninput.min.js"></script>
<!-- endsimple -->
```

- If the task is run, this will generate a `vendor.js` file in specified `dest` folder and your html will have all these replaced with single `script` tag with path for `vendor.js`


Don't forget to hit a star, if this saved your life by working in your legacy project!
Also, switch to `webpack` asap!