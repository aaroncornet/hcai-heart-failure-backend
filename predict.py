from sklearn.ensemble import RandomForestClassifier
import joblib
import sys

value = [[
    sys.argv[1],
    sys.argv[2], 
    sys.argv[3], 
    sys.argv[4],
    sys.argv[5],
    sys.argv[6],
    sys.argv[7],
    sys.argv[8],
    sys.argv[9],
    sys.argv[10],
    sys.argv[11]]]

rf = joblib.load('rf.joblib')
prediction = rf.predict(value)

print(prediction[0])