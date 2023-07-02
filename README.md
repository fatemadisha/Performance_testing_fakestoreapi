# Performance_testing_fakestoreapi
Dear, 

I’ve completed performance test on frequently used API for test App https://fakestoreapi.com. <br/>
Test executed for the below mentioned scenario in server https://fakestoreapi.com. 

* 10 Concurrent Request with 10 Loop Count; Avg TPS for Total Samples is ~ 22.5 And Total Concurrent API requested: 2900
* 50 Concurrent Request with 10 Loop Count; Avg TPS for Total Samples is ~ 100 And Total Concurrent API requested: 29000
* 100 Concurrent Request with 10 Loop Count; Avg TPS for Total Samples is ~ 103 And Total Concurrent API requested: 29000
* 200 Concurrent Request with 10 Loop Count; Avg TPS for Total Samples is ~ 105 And Total Concurrent API requested: 58000
* 300 Concurrent Request with 10 Loop Count; Avg TPS for Total Samples is ~ 111 And Total Concurrent API requested: 87000

```diff
- While executed 100 concurrent request, found 7 request got connection timeout and error rate is 0.01%.
```
<b>Summary:</b> Server can handle almost concurrent 250 API call with almost zero (0) error rate.

Please find the details report from the attachment.

Report Image:
![report_img]
