import cv2
import numpy as np

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

imagem_referencia = cv2.imread("imgs/WIN_20241110_01_02_52_Pro.jpg")
imagem_referencia_gray = cv2.cvtColor(imagem_referencia, cv2.COLOR_BGR2GRAY)

faces_referencia = face_cascade.detectMultiScale(imagem_referencia_gray, scaleFactor=1.1, minNeighbors=5)

if len(faces_referencia) == 0:
    print("Nenhuma face encontrada na foto de referência.")
    exit()

x, y, w, h = faces_referencia[0]
face_referencia = imagem_referencia_gray[y:y+h, x:x+w]

recognizer = cv2.face.LBPHFaceRecognizer_create()

recognizer.train([face_referencia], np.array([0]))

video_capture = cv2.VideoCapture(0)

while True:
    ret, frame = video_capture.read()
    
    gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    
    faces_live = face_cascade.detectMultiScale(gray_frame, scaleFactor=1.1, minNeighbors=5)
    
    for (x, y, w, h) in faces_live:
        face_live = gray_frame[y:y+h, x:x+w]
        
        label, confidence = recognizer.predict(face_live)
        
        if confidence < 100:
            cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
            cv2.putText(frame, "Mesma Pessoa", (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)
        else:
            cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 0, 255), 2)
            cv2.putText(frame, "Pessoa Diferente", (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 255), 2)

    cv2.imshow('Reconhecimento Facial', frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

video_capture.release()
cv2.destroyAllWindows()
