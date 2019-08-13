

# Customize OSU 1Search UI Package


## Primo Explore Devenv

- <b>github</b> : https://github.com/ExLibrisGroup/primo-explore-devenv.


## Instruction for installtion

- <b>URL</b> : https://www.orbiscascade.org/file_viewer.php?id=9121


## OSU 1Search Customization Workflow

1.  Download OSU UI package from Primo BackOffice (PBO) of 1Search and unzip as OSU

2.  cp downloaded package (OSU) to primo-explorer/custom of primo explorer devenv

3.  Point local devenv to OSU's Sandbox: 
      - gulp/config.js
         - var PROXY_SERVER = 'http://alliance-primo-sb.hosted.exlibrisgroup.com'

4.  Make changes (e.g., custom1.js or custom1.css)

5.  Test changes (remember: local devenv is pointing to Sandbox)
      - go to 1search-ui-package
         - gulp run --view OSU
      - visit : http://localhost:8003/primo-explore/search?vid=OSU

6.  If test passes
   - git commit
   - git push to 1search-ui-package
   - zip OSU package and save the zip file to a separate directory

7.  Deploy
   - upload zip file to 1Search PBO
   - deploy views
