# testingtools lib

I need to have a testing framework that does not contain any external dependency from npm or anywheere else but this repo, so I can write unit, integration tests and e2e tests and even perhaps snapshots.

We need to be able to assert whether a condition was matched or not.

We need to be able to count successes and failures

We need to be able to produce a nice output that will show a small report of how many tests ran, how many succeeded, how many failed, how many were skipped.

I think that would be nice if we were able to write a testing framework simple like the golang's standard testing lib but with a nicer output or a girkin-like testing framework where we can easily reuse code and write the test cases simply by writing text.
We can have booth!

Let's create two files with two different style framework! One using go-like syntax but with a nicer output and the other as a girkin like one.
