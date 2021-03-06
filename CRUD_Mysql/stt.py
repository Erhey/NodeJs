# Le fichier python

#################################################################
# Etape 1 : 2.1 Generation D'un fichier id
# sample name : whole_v(x+1)_id
# contents : 
# username=6d6305e3-1223-41e1-99ee-f11fc2f61ed3 <※1>
# password=Ru3pEtpYyDXL <※1>
# customization=     <Firstly empty>
# a_customization=   <Firstly empty>

# <※1> Il faut savoir ou et comment on obtient ces infos
# Ces informations sont donnees de base 固定情報

#################################################################
# Etape 2 : Creation du fichier de customization : model.txt 
# (pas en local. On le post d'abords sur le site pour ensuite le recuperer)
# $ cd /c/voice-gateway/stt/word_material
# $ ./stt_word_create.sh whole_v1

#################################################################
# Etape 3 : Recuperation du fichier enregistrer sur le serveur : model.txt 
# $ ./stt_word_get_model.sh whole_v1 > model.txt

#################################################################
# Etape 4 : Verification de L'etat de model.txt
# A)  (Le status doit etre ready. A moi de voir comment recuperer cet id et de check sa value)
# B)  En parallele, recuperer l'id de customization et l'inserer dans le fichier creer a l'etape 1

#################################################################
# Etape 5 : Lancer le Training
# $ cd /c/voice-gateway/stt/word_material
# $ ./stt_word_train.sh ＜モデル略称＞_v＜バージョン＞

###########################   質問    ###########################   
#　トレーニング実行時点　：　
#       - model.txtにてerror項目を持っているワードがありますが、
#       それをトレーニングする前に消しておきますか。
#       それとも、トレーニングを行い、エラーが発生したものを取得し、エラーワードをエンコードし、
#       次のコマンドを実行で繰り返すか。
#           →　　$ cd /c/voice-gateway/stt/word_material
#           →　　$ ./stt_delete_word.sh ＜モデル略称＞_v＜バージョン＞ ＜URLエンコード済みword＞

#################################################################
# Etape 6  : Quand le training a finalement ete creer on test l'application et on observe le resultat.
# $ cd /c/voice-gateway/stt/test_material
# $ ./stt_voice_test_wav.sh＜モデル略称＞_v＜バージョン＞


