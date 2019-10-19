# ### SET FOLDER TO WATCH + FILES TO WATCH + SUBFOLDERS YES/NO
$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = "C:\Users\43992463\Documents\TextObject\src"
$watcher.NotifyFilter = [System.IO.NotifyFilters]::LastWrite
$watcher.Filter = "*.*"
$watcher.IncludeSubdirectories = $false #true to copy subfolders
# $watcher.EnableRaisingEvents = $true  


# ### DEFINE ACTIONS AFTER AN EVENT IS DETECTED
$action = { 
                Write-Host "Starting"
                $extensionName = "TextObject"
                $qEnv = "cp-uat-sense.systems.uk.hsbc"
                
               
                # function generateWBL {
                #     # remove the existing wbfolder.wbl (if exists)
                #     Remove-Item .\src\wbfolder.wbl -ErrorAction Ignore

                #     # list all files under the src folder and add them to the wbl file
                #     $existingFiles = Get-ChildItem -Path .\src\ -File |
                #         foreach {$_.name} |
                #         Out-File -FilePath .\src\wbfolder.wbl
                # }

                function compressFolder{
                    # archive the content of the src folder
                    Compress-Archive -Path .\src\* -DestinationPath .\build\$extensionName.zip -Force
                    Write-Host ZIP file created
                }
                
                function connectQlik {
                    ## connect to Qlik using Qlik-CLI
                    Connect-Qlik -computerName "$qEnv" -TrustAllCerts
                    Write-Host Connected to Qlik
                }

                function removeOldExtVersion {
                    # Query Qlik for extension with the same name
                    $ext = Get-QlikExtension -Filter "name eq '$extensionName'" | Measure-Object

                    # if there is such extension - delete it
                    if ( $ext.Count -gt 0) {
                        Remove-QlikExtension -ename "$extensionName"
                        Write-Host Older version found and removed
                    }
                }

                function importExtension {
                    # Import the archive for the build folder
                    Import-QlikExtension -ExtensionPath .\build\$extensionName.zip
                    Write-Host New version was imported
                }
             # generateWBL
            compressFolder
            connectQlik
            removeOldExtVersion
            importExtension            
          }    
# ### DECIDE WHICH EVENTS SHOULD BE WATCHED 
Register-ObjectEvent $watcher "Created" -SourceIdentifier CreateQlik -Action $action
Register-ObjectEvent $watcher "Changed" -SourceIdentifier ChangeQlik -Action $action
Register-ObjectEvent $watcher "Deleted" -SourceIdentifier DeleteQlik -Action $action
Register-ObjectEvent $watcher "Renamed" -SourceIdentifier RenameQlik -Action $action
# #    while ($true) {}
#     # {sleep 5}

# # ## To start again
#     # Get-EventSubscriber -Force | Unregister-Event -Force