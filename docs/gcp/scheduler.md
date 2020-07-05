

gcloud scheduler jobs delete [my-job]

gcloud scheduler jobs create http JOB --schedule=SCHEDULE --uri=URI [optional flags]

EXAMPLE:
gcloud scheduler jobs create http my-http-job --schedule "0 1 * * 0" --uri "http://myproject/my-url.com" --http-method GET



---

To use the HTTP target:

For JOB, Specify a name for the job. It must be unique in the project. Note that you cannot re-use a job name in a project even if you delete its associated job.

Specify the schedule, also called frequency, or job interval, at which the job is to run, for example, `every 3 hours". The string you supply here can be any unix-cron compatible string. You can also use the legacy App Engine cron syntax to describe the schedule.

For more information, see Configuring Job Schedules.

Specify the fully qualified URL of the endpoint the job will contact.

Optionally, specify the HTTP method. The default is POST.

Optionally, specify the data to be sent to the target. This data is sent in the body of the request as bytes when either the POST or PUT HTTP method is selected.

Optionally set the retry values, which specify how the App Engine job is to be retried in case of failure. In most cases, the defaults will be sufficient. For more information, see the gcloud command line reference

Other optional parameters are available, such as timezone, description, and other parameters, which are described in the gcloud command line reference

To create an HTTP Target job that requires authentication, see Using Authentication with HTTP Targets